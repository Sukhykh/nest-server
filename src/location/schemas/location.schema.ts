import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Location {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({
    required: true,
    type: {
      lat: { type: String, required: true },
      lon: { type: String, required: true },
    },
  })
  coordinates: { lat: string; lon: string };

  @Prop({ required: true })
  type: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
