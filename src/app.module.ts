import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { FirebaseAdminService } from './firebase-admin/firebase-admin.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [FirebaseAdminService],
})
export class AppModule {}
