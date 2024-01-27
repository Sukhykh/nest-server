import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Coordinates } from './coordinates.dto';

export class CreateLocationDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name should be a string' })
  name: string;

  @IsNotEmpty({ message: 'Coordinates should not be empty' })
  @IsObject({ message: 'Coordinates should be an object' })
  coordinates: Coordinates;

  @IsNotEmpty({ message: 'Type should not be empty' })
  @IsString({ message: 'Type should be a string' })
  type: string;
}
