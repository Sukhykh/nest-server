import { Test, TestingModule } from '@nestjs/testing';
import { OsmIntegrationController } from './osm-integration.controller';
import { OsmIntegrationService } from './osm-integration.service';
import { MyEnvironmentDto } from './dto/myEnvironmentDto.dto';
import { RundomEnvironmentDto } from './dto/rundomEnvironmentDto.dto';
import { ShortestWayDto } from './dto/shortestWayDto.dto';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { LocationService } from '../location/location.service';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { Location, LocationSchema } from '../location/schemas/location.schema';

describe('OsmIntegrationController', () => {
  let controller: OsmIntegrationController;
  let service: OsmIntegrationService;
  let app: INestApplication;
  let mongo: MongoMemoryServer;

  beforeEach(async () => {
    mongo = await MongoMemoryServer.create();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: mongo.getUri(),
          }),
        }),
        MongooseModule.forFeature([
          { name: Location.name, schema: LocationSchema },
        ]),
      ],
      controllers: [OsmIntegrationController],
      providers: [OsmIntegrationService, LocationService],
    }).compile();

    controller = module.get<OsmIntegrationController>(OsmIntegrationController);
    service = module.get<OsmIntegrationService>(OsmIntegrationService);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    if (mongo) {
      await mongo.stop();
    }
    if (app) {
      await app.close();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyEnvironment', () => {
    it('should get environment by ID', async () => {
      const id = 'exampleId';
      const myEnvironmentDto: MyEnvironmentDto = {
        radius: 1000,
        type: 'shop',
      };
      const expectedResult = [{}] as any;
      jest.spyOn(service, 'getMyEnvironment').mockResolvedValue(expectedResult);
      const response = await request(app.getHttpServer())
        .get(`/osm/place/${id}`)
        .send(myEnvironmentDto)
        .expect(HttpStatus.OK);
      expect(response.body).toEqual(expectedResult);
    });
  });

  describe('getRundomEnvironment', () => {
    it('should get random environment', async () => {
      const rundomEnvironmentDto: RundomEnvironmentDto = {
        radius: 1000,
        coordinates: {
          lat: '48.8566',
          lon: '2.3522',
        },
        type: 'shop',
      };
      const expectedResult = [{}] as any;
      jest
        .spyOn(service, 'getRundomEnvironment')
        .mockResolvedValue(expectedResult);
      const response = await request(app.getHttpServer())
        .get('/osm/place')
        .send(rundomEnvironmentDto)
        .expect(HttpStatus.OK);
      expect(response.body).toEqual(expectedResult);
    });
  });

  describe('getShortestWay', () => {
    it('should get shortest way', async () => {
      const shortestWayDto: ShortestWayDto = {
        fromPoint: {
          lat: '51.2022',
          lon: '7.01846',
        },
        toPoint: {
          lat: '51.20315',
          lon: '7.0196',
        },
      };
      const expectedResult = {
        path: [],
        distance: 142.63139978691336,
        unit: 'meter',
      };
      jest.spyOn(service, 'getShortestWay').mockResolvedValue(expectedResult);
      const response = await request(app.getHttpServer())
        .get('/osm/way')
        .send(shortestWayDto)
        .expect(HttpStatus.OK);
      expect(response.body).toEqual(expectedResult);
    });
  });
});
