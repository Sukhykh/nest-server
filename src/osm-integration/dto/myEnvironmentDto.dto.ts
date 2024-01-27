import { IsNotEmpty, IsNumber, IsString, Validate } from 'class-validator';

export class MyEnvironmentDto {
  @IsNotEmpty({ message: 'Radius should not be empty' })
  @IsNumber({}, { message: 'Radius should be a number' })
  @Validate((value: number) => value > 0, {
    message: 'Radius should be a number greater than 0',
  })
  radius: number;

  @IsNotEmpty({ message: 'Type should not be empty' })
  @IsString({ message: 'Type should be a string' })
  type: string;
}
