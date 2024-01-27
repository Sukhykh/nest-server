import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location.dto';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Coordinates } from './coordinates.dto';
import { Type } from 'class-transformer';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @IsOptional()
  @IsString({ message: 'Name should be a string' })
  name?: string;

  @IsOptional()
  @IsObject({ message: 'Coordinates should be an object' })

  //TODO: How to add custom error or use errors from Coordinates
  @ValidateNested({ each: true })
  @Type(() => Coordinates)
  coordinates?: Coordinates;

  @IsOptional()
  @IsString({ message: 'Type should be a string' })
  type?: string;
}
