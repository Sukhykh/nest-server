import { Injectable } from '@nestjs/common';
import { MyEnvironmentDto } from './dto/myEnvironmentDto.dto';
import axios from 'axios';
import { RundomEnvironmentDto } from './dto/rundomEnvironmentDto.dto';
import { LocationService } from '../location/location.service';
import { AroundHelper, ShortestWay } from './helpers/osm-integration.helper';
import { OVERPASS_API_URL } from '../common/constants/constants';
import { ShortestWayDto } from './dto/shortestWayDto.dto';
import { Edge, Graph, alg } from 'graphlib';
import { haversineDistance } from '../common/utilities/haversineDistance.utility';

@Injectable()
export class OsmIntegrationService {
  constructor(private readonly locationService: LocationService) {}

  async getMyEnvironment(id: string, myEnvironmentDto: MyEnvironmentDto) {
    try {
      const { radius, type } = myEnvironmentDto;
      const location = await this.locationService.getOne(id);
      const lat = location.coordinates.lat;
      const lon = location.coordinates.lon;
      const overpassQuery = AroundHelper.generateQuery(radius, lat, lon, type);
      const response = await axios.post(OVERPASS_API_URL, overpassQuery);
      return response.data.elements;
    } catch (error) {
      throw error;
    }
  }

  async getRundomEnvironment(rundomEnvironmentDto: RundomEnvironmentDto) {
    try {
      const { radius, type } = rundomEnvironmentDto;
      const { lat, lon } = rundomEnvironmentDto.coordinates;
      const overpassQuery = AroundHelper.generateQuery(radius, lat, lon, type);
      const response = await axios.post(OVERPASS_API_URL, overpassQuery);
      return response.data.elements;
    } catch (error) {
      throw error;
    }
  }

  async getShortestWay(shortestWayDto: ShortestWayDto) {
    const { lat: latFrom, lon: lonFrom } = shortestWayDto.fromPoint;
    const { lat: latTo, lon: lonTo } = shortestWayDto.toPoint;
    const bbox = `${latFrom},${lonFrom},${latTo},${lonTo}`;
    try {
      const overpassQuery = ShortestWay.generateQuery(bbox);
      const response = await axios.post(OVERPASS_API_URL, overpassQuery);
      const pathGraph = new Graph();
      const roads = response.data.elements.map((road) => road.geometry);
      for (let outher = 0; outher < roads.length - 1; outher++) {
        for (let inner = 0; inner < roads[outher].length - 1; inner++) {
          if (roads[outher][inner + 1]) {
            const { lat: lat1, lon: lon1 } = roads[outher][inner];
            const { lat: lat2, lon: lon2 } = roads[outher][inner + 1];
            const distanceValue = haversineDistance({ lat1, lon1, lat2, lon2 });
            pathGraph.setEdge(`${lat1},${lon1}`, `${lat2},${lon2}`, {
              distance: distanceValue,
            });
          }
        }
      }
      const findNearestNode = (graph, lat2, lon2) => {
        let nearestNode = null;
        let minDistance = Infinity;
        const allNodes = graph.nodes();
        for (let i = 0; i < allNodes.length - 1; i++) {
          const coordinates = allNodes[i].split(',');
          const [lat1, lon1] = coordinates;
          const distanceValue = haversineDistance({ lat1, lon1, lat2, lon2 });
          if (distanceValue < minDistance) {
            minDistance = distanceValue;
            nearestNode = coordinates;
          }
        }
        console.log([nearestNode, minDistance]);
        return [nearestNode, minDistance];
      };
      const [nearestFrom, distanceValueFrom] = findNearestNode(
        pathGraph,
        latFrom,
        lonFrom,
      );
      console.log('from', [nearestFrom, distanceValueFrom]);
      const [nearestTo, distanceValueTo] = findNearestNode(
        pathGraph,
        latTo,
        lonTo,
      );
      console.log('to', [nearestTo, distanceValueTo]);
      pathGraph.setEdge(
        `${latFrom},${lonFrom}`,
        `${nearestFrom[0]},${nearestFrom[1]}`,
        {
          distance: distanceValueFrom,
        },
      );
      pathGraph.setEdge(
        `${nearestTo[0]},${nearestTo[1]}`,
        `${latTo},${lonTo}`,
        {
          distance: distanceValueTo,
        },
      );
      const allPath = alg.dijkstra(
        pathGraph,
        `${latFrom},${lonFrom}`,
        (e: Edge) => (pathGraph.edge(e) as { distance: number }).distance,
      );
      let currentCoords = `${latTo},${lonTo}`;
      const path = [];
      while (currentCoords !== `${latFrom},${lonFrom}`) {
        const pathInfo = allPath[currentCoords];
        if (!pathInfo || pathInfo.distance === null) {
          break;
        }
        path.push(currentCoords);
        currentCoords = pathInfo.predecessor;
      }
      path.push(`${latFrom},${lonFrom}`);
      const reversedPath = path.reverse();
      return {
        path: reversedPath,
        distance: allPath[`${latTo},${lonTo}`].distance,
      };
    } catch (error) {
      throw error;
    }
  }
}
