import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserProfile extends Document {
  @Prop({ required: true, unique: true })
  userId: number;

  @Prop({ required: false })
  telefono?: string;

  @Prop({ required: false })
  direccion?: string;

  @Prop({ required: false })
  avatarUrl?: string;

  @Prop({ required: false })
  fechaNacimiento?: Date;

  @Prop({ required: false })
  genero?: string;

  @Prop({ type: Object, required: false })
  preferencias?: {
    notificacionesEmail: boolean;
    notificacionesSMS: boolean;
    recordatoriosCitas: boolean;
  };
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);