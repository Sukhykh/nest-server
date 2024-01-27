import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class Coordinates {
  @IsNotEmpty({ message: 'Latitude should not be empty' })
  @IsLatitude({ message: 'Invalid Latitude format' })
  lat: string;

  @IsNotEmpty({ message: 'Longitude should not be empty' })
  @IsLongitude({ message: 'Invalid Longitude format' })
  lon: string;
}
