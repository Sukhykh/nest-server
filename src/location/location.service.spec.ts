import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { Location } from './schemas/location.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { ConflictException, ValidationPipe } from '@nestjs/common';
import { configureValidationPipe } from '../common/pipes/validation.pipe';
import { Model } from 'mongoose';

class MockModel {
  constructor(private data: any) {}

  save = jest.fn().mockResolvedValue(this.data);
  exec = jest.fn().mockResolvedValue(this.data);
  findOne = jest.fn().mockReturnThis();
  find = jest.fn().mockResolvedValue([this.data]);
  findById = jest.fn().mockResolvedValue(this.data);
  findByIdAndUpdate = jest.fn().mockResolvedValue(this.data);
  findByIdAndDelete = jest.fn().mockResolvedValue(this.data);
  countDocuments = jest.fn().mockResolvedValue(1);
}

describe('LocationService', () => {
  let service: LocationService;
  let model: Model<Location>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getModelToken(Location.name),
          useValue: new MockModel({}),
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    model = module.get<Model<Location>>(getModelToken(Location.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new location', async () => {
      const createLocationDto = {
        name: 'Test location one',
        coordinates: {
          lat: '48.8566',
          lon: '2.3522',
        },
        type: 'restaurant',
      };

      jest.spyOn(model, 'findOne').mockReturnValueOnce(null);

      const result = await service.create(createLocationDto);

      expect(result.message).toEqual('Location created successfully!');
      expect(result.newLocation).toEqual(createLocationDto);
    });

    it('should throw ConflictException if location already exists', async () => {
      const createLocationDto = {
        name: 'Test location one',
        coordinates: {
          lat: '48.8566',
          lon: '2.3522',
        },
        type: 'restaurant',
      };
      jest.spyOn(model, 'findOne').mockReturnThis();
      await expect(service.create(createLocationDto)).rejects.toThrowError(
        ConflictException,
      );
    });
  });
});
