import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropsService } from './crops.service';
import { CropsController } from './crops.controller';
import { Crop } from './entities/crop.entity';
import { FarmlandsModule } from '../farmland/farmlands.module';

@Module({
  imports: [TypeOrmModule.forFeature([Crop]), FarmlandsModule],
  controllers: [CropsController],
  providers: [CropsService],
  exports: [CropsService],
})
export class CropsModule {}
