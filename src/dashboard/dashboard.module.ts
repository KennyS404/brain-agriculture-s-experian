import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

import { ProducersModule } from '../producers/producers.module';
import { CropsModule } from '../crops/crops.module';
import { FarmlandsModule } from '../farmland/farmlands.module';
@Module({
  imports: [FarmlandsModule, ProducersModule, CropsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
