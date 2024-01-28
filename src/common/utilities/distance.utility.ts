type Distance = {
  lat1: string | number;
  lon1: string | number;
  lat2: string | number;
  lon2: string | number;
};

export const distance = ({ lat1, lon1, lat2, lon2 }: Distance) => {
  const lat1Num = typeof lat1 === 'string' ? parseFloat(lat1) : lat1;
  const lon1Num = typeof lon1 === 'string' ? parseFloat(lon1) : lon1;
  const lat2Num = typeof lat2 === 'string' ? parseFloat(lat2) : lat2;
  const lon2Num = typeof lon2 === 'string' ? parseFloat(lon2) : lon2;
  const deltaX = lat2Num - lat1Num;
  const deltaY = lon2Num - lon1Num;
  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  return distance;
};
