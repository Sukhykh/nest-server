import { IsNotEmpty, IsObject } from 'class-validator';
import { Coordinates } from '../../location/dto/coordinates.dto';

export class ShortestWayDto {
  @IsNotEmpty({ message: 'Coordinates should not be empty' })
  @IsObject({ message: 'Coordinates should be an object' })
  fromPoint: Coordinates;

  @IsNotEmpty({ message: 'Coordinates should not be empty' })
  @IsObject({ message: 'Coordinates should be an object' })
  toPoint: Coordinates;
}
