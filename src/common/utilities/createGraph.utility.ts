import { Graph } from 'graphlib';
import { haversineDistance } from './haversineDistance.utility';
import { findNearestNode } from './findNearestNode.utility';

export const createGraph = (response, coordinates) => {
  const { latFrom, lonFrom, latTo, lonTo } = coordinates;
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
  const [nearestFrom, distanceValueFrom] = findNearestNode(
    pathGraph,
    latFrom,
    lonFrom,
  );
  const [nearestTo, distanceValueTo] = findNearestNode(pathGraph, latTo, lonTo);
  pathGraph.setEdge(
    `${latFrom},${lonFrom}`,
    `${nearestFrom[0]},${nearestFrom[1]}`,
    {
      distance: distanceValueFrom,
    },
  );
  pathGraph.setEdge(`${nearestTo[0]},${nearestTo[1]}`, `${latTo},${lonTo}`, {
    distance: distanceValueTo,
  });
  return pathGraph;
};
