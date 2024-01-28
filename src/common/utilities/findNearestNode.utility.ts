import { haversineDistance } from './haversineDistance.utility';

export const findNearestNode = (graph, lat2, lon2) => {
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
  return [nearestNode, minDistance];
};
