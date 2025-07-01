import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class AppointmentLog extends Document {
  @Prop({ required: true })
  appointmentId: number;

  @Prop()
  estadoAnterior: string;

  @Prop()
  estadoNuevo: string;

  @Prop()
  comentario?: string;

  @Prop({ default: Date.now })
  fechaCambio: Date;
}
