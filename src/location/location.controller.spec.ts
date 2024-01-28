import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location, LocationSchema } from './schemas/location.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { CreatedLocation } from '../common/types/createdLocation.type';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;
  let mongo: MongoMemoryServer;

  beforeEach(async () => {
    mongo = await MongoMemoryServer.create();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [LocationService],
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
    }).compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  afterEach(async () => {
    if (mongo) {
      await mongo.stop();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new location', async () => {
      const createLocationDto: CreateLocationDto = {
        name: 'Test location',
        coordinates: {
          lat: '51.2022',
          lon: '7.01846',
        },
        type: 'Test type',
      };
      const createdLocation = {
        name: 'Test location',
        coordinates: {
          lat: '51.2022',
          lon: '7.01846',
          _id: 'newCoordinatesID',
        },
        type: 'Test type',
        _id: 'newLocationID',
        __v: 0,
      };
      jest.spyOn(service, 'create').mockResolvedValue(createdLocation as any);
      const result = {
        message: 'Location created successfully!',
        newLocation: await controller.create(createLocationDto),
      };
      const expectedResult: {
        message: string;
        newLocation: CreatedLocation;
      } = {
        message: 'Location created successfully!',
        newLocation: createdLocation,
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAll', () => {
    it('should get all locations', async () => {
      const locations = [
        {
          _id: '65b3b23e9a4a6bf7a230cef8',
          name: 'Sample Location one',
          coordinates: {
            lat: '-80.345',
            lon: '-67.890',
            _id: '65b3b3c6c5220c49defc02af',
          },
          type: 'Sample Type',
          __v: 0,
        },
        {
          _id: '65b3b2ce9a4a6bf7a230cf0b',
          name: 'Sample Location two',
          coordinates: {
            lat: '12.345',
            lon: '67.890',
            _id: '65b3b2ce9a4a6bf7a230cf0c',
          },
          type: 'Sample Type',
          __v: 0,
        },
      ];
      jest.spyOn(service, 'getAll').mockResolvedValue(locations as any);
      const result = {
        data: await controller.getAll(),
      };
      const expectedResult: {
        data: CreatedLocation[];
      } = {
        data: locations,
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should get a single location by ID', async () => {
      const locationId = '65b3b23e9a4a6bf7a230cef8';
      const location = {
        _id: '65b3b23e9a4a6bf7a230cef8',
        name: 'Sample Location new',
        coordinates: {
          lat: '-80.345',
          lon: '-67.890',
          _id: '65b3b3c6c5220c49defc02af',
        },
        type: 'Sample Type',
        __v: 0,
      };
      jest.spyOn(service, 'getOne').mockResolvedValue(location as any);
      const result = await controller.findOne(locationId);
      const expectedResult: CreatedLocation = location;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a location by ID', async () => {
      const locationId = 'updatedLocationID';
      const updateLocationDto: UpdateLocationDto = {
        name: 'Test location',
        coordinates: {
          lat: '51.2022',
          lon: '7.01846',
        },
        type: 'Test type',
      };
      const updatedLocation = {
        name: 'Test location',
        coordinates: {
          lat: '51.2022',
          lon: '7.01846',
          _id: 'updatedCoordinatesID',
        },
        type: 'Test type',
        _id: 'updatedLocationID',
        __v: 0,
      };
      jest.spyOn(service, 'update').mockResolvedValue(updatedLocation as any);
      const result = {
        message: 'Location updated successfully!',
        updatedLocation: await controller.update(locationId, updateLocationDto),
      };
      const expectedResult: {
        message: string;
        updatedLocation: CreatedLocation;
      } = {
        message: 'Location updated successfully!',
        updatedLocation: updatedLocation,
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a location by ID', async () => {
      const locationId = '65b3b23e9a4a6bf7a230cef8';
      const removedLocation = {
        _id: '65b3b23e9a4a6bf7a230cef8',
        name: 'Sample Location new',
        coordinates: {
          lat: '-80.345',
          lon: '-67.890',
          _id: '65b3b3c6c5220c49defc02af',
        },
        type: 'Sample Type',
        __v: 0,
      };
      jest.spyOn(service, 'remove').mockResolvedValue(removedLocation as any);
      const result = {
        message: 'Location deleted successfully!',
        deletedLocation: await controller.remove(locationId),
      };
      const expectedResult: {
        message: string;
        deletedLocation: CreatedLocation;
      } = {
        message: 'Location deleted successfully!',
        deletedLocation: removedLocation as CreatedLocation,
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
