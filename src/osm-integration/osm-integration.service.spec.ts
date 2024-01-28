import { Test, TestingModule } from '@nestjs/testing';
import { OsmIntegrationService } from './osm-integration.service';
import { LocationService } from '../location/location.service';
import { MyEnvironmentDto } from './dto/myEnvironmentDto.dto';
import { Location } from '../location/schemas/location.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { RundomEnvironmentDto } from './dto/rundomEnvironmentDto.dto';

jest.mock('axios');

describe('OsmIntegrationService', () => {
  let osmIntegrationService: OsmIntegrationService;
  let locationService: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OsmIntegrationService,
        LocationService,
        {
          provide: getModelToken(Location.name),
          useValue: {} as Model<Location>,
        },
      ],
    }).compile();

    osmIntegrationService = module.get<OsmIntegrationService>(
      OsmIntegrationService,
    );
    locationService = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(osmIntegrationService).toBeDefined();
    expect(locationService).toBeDefined();
  });

  describe('getMyEnvironment', () => {
    it('should return elements', async () => {
      const mockedResponse = {
        data: {
          elements: [
            {
              type: 'node',
              id: 251056295,
              lat: 48.8577346,
              lon: 2.3566096,
              tags: {
                amenity: 'cafe',
                name: 'Mariage Frères',
              },
            },
          ],
        },
      };
      (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue(
        mockedResponse,
      );
      const id = 'your_id';
      const myEnvironmentDto: MyEnvironmentDto = {
        radius: 100,
        type: 'your_type',
      };
      jest
        .spyOn(osmIntegrationService['locationService'], 'getOne')
        .mockResolvedValueOnce({
          coordinates: { lat: '0', lon: '0' },
        } as any);
      const result = await osmIntegrationService.getMyEnvironment(
        id,
        myEnvironmentDto,
      );
      expect(result).toBeDefined();
    });

    it('should throw an error if Axios request fails', async () => {
      (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValue(
        new Error('Mocked error'),
      );
      jest
        .spyOn(locationService, 'getOne')
        .mockResolvedValueOnce({ coordinates: { lat: '0', lon: '0' } } as any);
      const id = 'your_id';
      const myEnvironmentDto: MyEnvironmentDto = {
        radius: 100,
        type: 'your_type',
      };
      await expect(
        osmIntegrationService.getMyEnvironment(id, myEnvironmentDto),
      ).rejects.toThrowError('Mocked error');
    });
  });

  describe('getRundomEnvironment', () => {
    it('should return elements', async () => {
      const mockedData = [
        {
          type: 'node',
          id: 251056295,
          lat: 48.8577346,
          lon: 2.3566096,
          tags: {
            amenity: 'cafe',
            name: 'Mariage Frères',
          },
        },
      ];
      const mockedResponse = { data: { elements: mockedData } };
      (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue(
        mockedResponse,
      );
      const rundomEnvironmentDto: RundomEnvironmentDto = {
        radius: 1000,
        coordinates: {
          lat: '48.8566',
          lon: '2.3522',
        },
        type: 'shop',
      };
      const result =
        await osmIntegrationService.getRundomEnvironment(rundomEnvironmentDto);
      expect(result).toBeDefined();
      expect(result).toEqual(mockedData);
    });

    it('should throw an error if Axios request fails', async () => {
      (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValue(
        new Error('Mocked error'),
      );
      const rundomEnvironmentDto: RundomEnvironmentDto = {
        radius: 1000,
        coordinates: {
          lat: '48.8566',
          lon: '2.3522',
        },
        type: 'shop',
      };
      await expect(
        osmIntegrationService.getRundomEnvironment(rundomEnvironmentDto),
      ).rejects.toThrowError('Mocked error');
    });
  });
});
