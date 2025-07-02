import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PetNotes extends Document {
  @Prop({ required: true })
  petId: number;

  @Prop({ required: true })
  veterinarioId: number;

  @Prop({ required: true })
  observaciones: string;

  @Prop({ required: false })
  diagnostico?: string;

  @Prop({ required: false })
  tratamiento?: string;

  @Prop([String])
  medicamentos?: string[];

  @Prop({ required: false })
  proximaVisita?: Date;

  @Prop({ default: Date.now })
  fecha: Date;
}

export const PetNotesSchema = SchemaFactory.createForClass(PetNotes);