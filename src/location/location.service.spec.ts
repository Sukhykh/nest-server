import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { Location } from './schemas/location.schema';
import { CreateLocationDto } from './dto/create-location.dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { UpdateLocationDto } from './dto/update-location.dto';

const mockLocationModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  countDocuments: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('LocationService', () => {
  let locationService: LocationService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getModelToken(Location.name),
          useValue: mockLocationModel,
        },
      ],
    }).compile();

    locationService = module.get<LocationService>(LocationService);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(locationService).toBeDefined();
  });

  describe('create', () => {
    it('should create a location', async () => {
      const createLocationDto: CreateLocationDto = {
        name: 'Sample Location new',
        coordinates: {
          lat: '-80.345',
          lon: '-67.890',
        },
        type: 'Sample Type',
      };
      const location = { _id: 'someId', name: 'Test Location' };
      mockLocationModel.findOne.mockResolvedValue(null);
      mockLocationModel.create.mockResolvedValue(location);
      const result = await locationService.create(createLocationDto);
      expect(mockLocationModel.findOne).toHaveBeenCalledWith({
        name: createLocationDto.name,
      });
      expect(mockLocationModel.create).toHaveBeenCalledWith(createLocationDto);
      expect(result).toEqual({
        message: 'Location created successfully!',
        createdLocation: location,
      });
    });

    it('should throw ConflictException if location already exists', async () => {
      const createLocationDto: CreateLocationDto = {
        name: 'Sample Location new',
        coordinates: {
          lat: '-80.345',
          lon: '-67.890',
        },
        type: 'Sample Type',
      };
      mockLocationModel.findOne.mockResolvedValue({});
      await expect(locationService.create(createLocationDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should rethrow any other error', async () => {
      const createLocationDto: CreateLocationDto = {
        name: 'Sample Location new',
        coordinates: {
          lat: '-80.345',
          lon: '-67.890',
        },
        type: 'Sample Type',
      };
      mockLocationModel.findOne.mockRejectedValue(
        new Error('Some unexpected error'),
      );
      await expect(
        locationService.create(createLocationDto),
      ).rejects.toThrowError('Some unexpected error');
    });
  });

  describe('getAll', () => {
    it('should get all locations with count', async () => {
      const locations = [
        { _id: '1', name: 'Location 1' },
        { _id: '2', name: 'Location 2' },
      ];
      const count = locations.length;
      mockLocationModel.find.mockResolvedValue(locations);
      mockLocationModel.countDocuments.mockResolvedValue(count);
      const result = await locationService.getAll();
      expect(mockLocationModel.find).toHaveBeenCalled();
      expect(mockLocationModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        data: locations,
        count,
      });
    });

    it('should handle an empty locations array', async () => {
      const locations = [];
      const count = 0;
      mockLocationModel.find.mockResolvedValue(locations);
      mockLocationModel.countDocuments.mockResolvedValue(count);
      const result = await locationService.getAll();
      expect(mockLocationModel.find).toHaveBeenCalled();
      expect(mockLocationModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        data: locations,
        count,
      });
    });

    it('should rethrow any error', async () => {
      const error = new Error('Some unexpected error');
      mockLocationModel.find.mockRejectedValue(error);
      await expect(locationService.getAll()).rejects.toThrowError(error);
    });
  });

  describe('getOne', () => {
    it('should get a location by ID', async () => {
      const locationId = 'someId';
      const location = { _id: locationId, name: 'Test Location' };
      mockLocationModel.findById.mockResolvedValue(location);
      const result = await locationService.getOne(locationId);
      expect(mockLocationModel.findById).toHaveBeenCalledWith(locationId);
      expect(result).toEqual(location);
    });

    it('should throw NotFoundException if location is not found', async () => {
      const locationId = 'nonExistentId';
      mockLocationModel.findById.mockResolvedValue(null);
      await expect(locationService.getOne(locationId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should rethrow any error', async () => {
      const locationId = 'someId';
      const error = new Error('Some unexpected error');
      mockLocationModel.findById.mockRejectedValue(error);
      await expect(locationService.getOne(locationId)).rejects.toThrowError(
        error,
      );
    });
  });

  describe('update', () => {
    it('should update a location by ID', async () => {
      const locationId = 'someId';
      const updateLocationDto: UpdateLocationDto = { name: 'Updated Location' };
      const updatedLocation = { _id: locationId, name: 'Updated Location' };
      mockLocationModel.findByIdAndUpdate.mockResolvedValue(updatedLocation);
      const result = await locationService.update(
        locationId,
        updateLocationDto,
      );
      expect(mockLocationModel.findByIdAndUpdate).toHaveBeenCalledWith(
        locationId,
        updateLocationDto,
        { new: true },
      );
      expect(result).toEqual({
        message: 'Location updated successfully!',
        updatedLocation,
      });
    });

    it('should throw NotFoundException if location is not found', async () => {
      const locationId = 'nonExistentId';
      const updateLocationDto: UpdateLocationDto = { name: 'Updated Location' };
      mockLocationModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(
        locationService.update(locationId, updateLocationDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should rethrow any error', async () => {
      const locationId = 'someId';
      const updateLocationDto: UpdateLocationDto = { name: 'Updated Location' };
      const error = new Error('Some unexpected error');
      mockLocationModel.findByIdAndUpdate.mockRejectedValue(error);
      await expect(
        locationService.update(locationId, updateLocationDto),
      ).rejects.toThrowError(error);
    });
  });

  describe('remove', () => {
    it('should remove a location by ID', async () => {
      const locationId = 'someId';
      const deletedLocation = { _id: locationId, name: 'Deleted Location' };
      mockLocationModel.findByIdAndDelete.mockResolvedValue(deletedLocation);
      const result = await locationService.remove(locationId);
      expect(mockLocationModel.findByIdAndDelete).toHaveBeenCalledWith(
        locationId,
        { new: true },
      );
      expect(result).toEqual({
        message: 'Location deleted successfully!',
        deletedLocation,
      });
    });

    it('should throw NotFoundException if location is not found', async () => {
      const locationId = 'nonExistentId';
      mockLocationModel.findByIdAndDelete.mockResolvedValue(null);
      await expect(locationService.remove(locationId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if something goes wrong', async () => {
      const locationId = 'someId';
      const error = new Error('Some unexpected error');
      mockLocationModel.findByIdAndDelete.mockRejectedValue(error);
      await expect(locationService.remove(locationId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
