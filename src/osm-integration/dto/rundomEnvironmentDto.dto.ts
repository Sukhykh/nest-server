import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Validate,
} from 'class-validator';
import { Coordinates } from '../../location/dto/coordinates.dto';

export class RundomEnvironmentDto {
  @IsNotEmpty({ message: 'Radius should not be empty' })
  @IsNumber({}, { message: 'Radius should be a number' })
  @Validate((value: number) => value > 0, {
    message: 'Radius should be a number greater than 0',
  })
  radius: number;

  @IsNotEmpty({ message: 'Coordinates should not be empty' })
  @IsObject({ message: 'Coordinates should be an object' })
  coordinates: Coordinates;

  @IsNotEmpty({ message: 'Type should not be empty' })
  @IsString({ message: 'Type should be a string' })
  type: string;
}
