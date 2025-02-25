import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { CropsModule } from './crops/crops.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FarmlandsModule } from './farmland/farmlands.module';
import { ProducersModule } from './producers/producers.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ProducersModule,
    FarmlandsModule,
    CropsModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
