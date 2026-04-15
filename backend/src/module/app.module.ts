import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.URI_MONGO), UserModule],
})
export class AppModule {}
