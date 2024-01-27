import { Module } from '@nestjs/common';
import { OsmIntegrationService } from './osm-integration.service';
import { OsmIntegrationController } from './osm-integration.controller';
import { LocationService } from 'src/location/location.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema } from 'src/location/schemas/location.schema';
import { Location } from '../location/schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [OsmIntegrationController],
  providers: [OsmIntegrationService, LocationService],
})
export class OsmIntegrationModule {}
