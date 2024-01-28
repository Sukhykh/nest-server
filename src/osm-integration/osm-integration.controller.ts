import {
  Controller,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { OsmIntegrationService } from './osm-integration.service';
import { ApiTags } from '@nestjs/swagger';
import { MyEnvironmentDto } from './dto/myEnvironmentDto.dto';
import { RundomEnvironmentDto } from './dto/rundomEnvironmentDto.dto';
import { ShortestWayDto } from './dto/shortestWayDto.dto';

@Controller('osm')
@ApiTags('Osm')
export class OsmIntegrationController {
  constructor(private readonly osmIntegrationService: OsmIntegrationService) {}

  @Get('/place/:id')
  @UsePipes(new ValidationPipe())
  getMyEnvironment(
    @Param('id') id: string,
    @Body() myEnvironmentDto: MyEnvironmentDto,
  ) {
    return this.osmIntegrationService.getMyEnvironment(id, myEnvironmentDto);
  }

  @Get('/place')
  @UsePipes(new ValidationPipe())
  getRundomEnvironment(
    @Body() rundomEnvironmentDto: RundomEnvironmentDto,
  ): Promise<any> {
    return this.osmIntegrationService.getRundomEnvironment(
      rundomEnvironmentDto,
    );
  }

  @Get('/way')
  @UsePipes(new ValidationPipe())
  getShortestWay(@Body() shortestWayDto: ShortestWayDto): Promise<any> {
    return this.osmIntegrationService.getShortestWay(shortestWayDto);
  }
}
