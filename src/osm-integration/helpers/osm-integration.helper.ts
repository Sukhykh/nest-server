export class AroundHelper {
  static generateQuery(
    radius: number,
    lat: number | string,
    lon: number | string,
    type: string,
  ): string {
    return `data=[out:json];
      (
        node(around:${radius},${lat},${lon})["${type}"];
      );
      out body;
    `;
  }
}

export class ShortestWay {
  static generateQuery(bbox: string): string {
    return `data=[out:json];way["highway"](${bbox});out geom;`;
  }
}
