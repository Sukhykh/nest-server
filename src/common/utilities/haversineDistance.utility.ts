type HaversineDistance = {
  lat1: string | number;
  lon1: string | number;
  lat2: string | number;
  lon2: string | number;
};

export const haversineDistance = ({
  lat1,
  lon1,
  lat2,
  lon2,
}: HaversineDistance) => {
  // Convert possible strings to numbers
  const lat1Num = typeof lat1 === 'string' ? parseFloat(lat1) : lat1;
  const lon1Num = typeof lon1 === 'string' ? parseFloat(lon1) : lon1;
  const lat2Num = typeof lat2 === 'string' ? parseFloat(lat2) : lat2;
  const lon2Num = typeof lon2 === 'string' ? parseFloat(lon2) : lon2;

  // Angle to radian function
  const toRadians = (angle) => angle * (Math.PI / 180);

  // Radius of the Earth in meters
  const R = 6371000;

  // The difference between latitude and longitude in radians
  const dLat = toRadians(lat2Num - lat1Num);
  const dLon = toRadians(lon2Num - lon1Num);

  // Haversine formula for determining the distance between two points
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in meters
  const distanceInMeters = R * c;

  return distanceInMeters;
};
