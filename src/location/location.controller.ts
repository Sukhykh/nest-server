import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('location')
@ApiTags('Location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  getAll() {
    return this.locationService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.getOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}
