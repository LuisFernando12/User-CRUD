import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'user' })
export class User {
  @Prop()
  name: string;
  @Prop({ unique: true })
  email: string;
  @Prop({ unique: true })
  cpf: string;
  @Prop()
  birthDate: string;
  @Prop()
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
