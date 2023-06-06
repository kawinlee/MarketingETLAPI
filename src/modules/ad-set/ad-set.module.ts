import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalModule } from 'src/global.module';
import { AdSetController } from './ad-set.controller';
import { AdSetService } from './ad-set.service';
import { AdSetCron } from './crons/ad-set.cron';
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    GlobalModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AdSetController],
  providers: [AdSetService, AdSetCron],
})
export class AdSetModule {}