import { Injectable } from '@nestjs/common';
import { MyEnvironmentDto } from './dto/myEnvironmentDto.dto';
import axios from 'axios';
import { RundomEnvironmentDto } from './dto/rundomEnvironmentDto.dto';
import { LocationService } from '../location/location.service';
import { AroundHelper, ShortestWay } from './helpers/osm-integration.helper';
import { OVERPASS_API_URL } from '../common/constants/constants';
import { ShortestWayDto } from './dto/shortestWayDto.dto';
import { createGraph } from '../common/utilities/createGraph.utility';
import { findPath } from '../common/utilities/findPath.utility';

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
      const pathGraph = createGraph(response, {
        latFrom,
        lonFrom,
        latTo,
        lonTo,
      });
      const shortestPath = findPath(pathGraph, {
        latFrom,
        lonFrom,
        latTo,
        lonTo,
      });
      return {
        path: shortestPath.path,
        distance: shortestPath.distance,
        unit: 'meter',
      };
    } catch (error) {
      throw error;
    }
  }
}
