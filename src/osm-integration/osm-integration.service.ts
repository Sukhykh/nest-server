import { Injectable } from '@nestjs/common';
import { MyEnvironmentDto } from './dto/myEnvironmentDto.dto';
import axios from 'axios';
import { RundomEnvironmentDto } from './dto/rundomEnvironmentDto.dto';
import { LocationService } from 'src/location/location.service';
import { AroundHelper, ShortestWay } from './helpers/osm-integration.helper';
import { OVERPASS_API_URL } from '../common/constants/constants';

@Injectable()
export class OsmIntegrationService {
  constructor(private readonly locationService: LocationService) {}

  async getMyEnvironment(id: string, myEnvironmentDto: MyEnvironmentDto) {
    try {
      const { radius, type } = myEnvironmentDto;
      const location = await this.locationService.getOne(id);
      const lat = location.coordinates.lat;
      const lon = location.coordinates.lon;
      const overpassQuery = AroundHelper.generateQuery(radius, lat, lon, type);
      const response = await axios.post(OVERPASS_API_URL, overpassQuery);
      return response.data.elements;
    } catch (error) {
      throw error;
    }
  }

  async getRundomEnvironment(rundomEnvironmentDto: RundomEnvironmentDto) {
    try {
      const { radius, type } = rundomEnvironmentDto;
      const { lat, lon } = rundomEnvironmentDto.coordinates;
      const overpassQuery = AroundHelper.generateQuery(radius, lat, lon, type);
      const response = await axios.post(OVERPASS_API_URL, overpassQuery);
      return response.data.elements;
    } catch (error) {
      throw error;
    }
  }

  async getShortestWay() {
    const bbox = '51.20117,7.01688,51.2052,7.0304';
    // console.log(shortestWayDto);
    try {
      const overpassQuery = ShortestWay.generateQuery(bbox);
      const response = await axios.post(OVERPASS_API_URL, overpassQuery);
      return response.data.elements;
    } catch (error) {
      throw error;
    }
  }
}
