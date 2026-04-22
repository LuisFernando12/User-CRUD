import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'user', timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ unique: true, required: true })
  email: string;
  @Prop({ unique: true, required: true })
  cpf: string;
  @Prop({ required: true })
  birthDate: string;
  @Prop({ required: true })
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
