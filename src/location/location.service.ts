import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from './schemas/location.schema';
import { validate } from 'class-validator';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    try {
      await validate(createLocationDto);
      const location = await this.locationModel.findOne({
        name: createLocationDto.name,
      });
      if (location) {
        throw new ConflictException('This location is already exist!');
      }
      const createdLocation =
        await this.locationModel.create(createLocationDto);
      return {
        message: 'Location created successfully!',
        createdLocation,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const allLocations = await this.locationModel.find();
      const count = await this.locationModel.countDocuments();
      return {
        data: allLocations,
        count,
      };
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: string) {
    try {
      const location = await this.locationModel.findById(id);
      if (!location) {
        throw new NotFoundException('This location is not found!');
      }
      return location;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<{ message: string; updatedLocation: Location }> {
    try {
      await validate(updateLocationDto);
      const updatedLocation = await this.locationModel.findByIdAndUpdate(
        id,
        updateLocationDto,
        { new: true },
      );
      if (!updatedLocation) {
        throw new NotFoundException('Location not found');
      }
      return {
        message: 'Location updated successfully!',
        updatedLocation,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(
    id: string,
  ): Promise<{ message: string; deletedLocation: Location }> {
    try {
      const deletedLocation = await this.locationModel.findByIdAndDelete(id, {
        new: true,
      });
      if (!deletedLocation) {
        throw new NotFoundException('Location not found');
      }
      return {
        message: 'Location deleted successfully!',
        deletedLocation,
      };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
