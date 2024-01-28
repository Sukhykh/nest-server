import { Edge, alg } from 'graphlib';

export const findPath = (pathGraph, coordinates) => {
  const { latFrom, lonFrom, latTo, lonTo } = coordinates;
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
  const distance = allPath[`${latTo},${lonTo}`].distance;
  return { path: reversedPath, distance };
};
