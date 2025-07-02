// src/models/schemas/appointment-logs.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AppointmentLog extends Document {
  @Prop({ required: true })
  appointmentId: number;

  @Prop({ required: true })
  usuarioId: number;

  @Prop({ required: true })
  estadoAnterior: string;

  @Prop({ required: true })
  estadoNuevo: string;

  @Prop()
  comentario?: string;

  @Prop()
  motivoCambio?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AppointmentLogSchema = SchemaFactory.createForClass(AppointmentLog);
