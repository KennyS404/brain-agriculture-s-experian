import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmlandsService } from './farmlands.service';
import { FarmlandsController } from './farmlands.controller';
import { Farmland } from './entities/farmland.entity';
import { ProducersModule } from '../producers/producers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Farmland]), ProducersModule],
  controllers: [FarmlandsController],
  providers: [FarmlandsService],
  exports: [FarmlandsService],
})
export class FarmlandsModule {}
