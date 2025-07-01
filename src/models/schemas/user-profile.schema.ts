import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserProfile extends Document {
  @Prop({ required: true })
  userId: number;

  @Prop()
  telefono: string;

  @Prop()
  direccion: string;

  @Prop()
  avatarUrl?: string;
}
