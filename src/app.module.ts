import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Modules } from './modules';
import { GlobalModule } from './global.module';

@Module({
  imports: [
    GlobalModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    ...Modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}