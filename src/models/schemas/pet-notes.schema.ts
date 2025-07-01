import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PetNotes extends Document {
  @Prop({ required: true })
  petId: number;

  @Prop()
  observaciones: string;

  @Prop({ default: Date.now })
  fecha: Date;
}
