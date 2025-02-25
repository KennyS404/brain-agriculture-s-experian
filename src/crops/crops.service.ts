import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from './entities/crop.entity';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { FarmlandsService } from '../farmland/farmlands.service';

@Injectable()
export class CropsService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
    private readonly farmlandsService: FarmlandsService,
  ) {}

  async createCrop(createCropDto: CreateCropDto): Promise<Crop> {
    const farmland = await this.farmlandsService.findFarmlandById(createCropDto.farmlandId);
    const newCrop = this.cropRepository.create({
      ...createCropDto,
      farmland,
    });
    return this.cropRepository.save(newCrop);
  }

  async findAllCrops(): Promise<Crop[]> {
    return this.cropRepository.find({ relations: ['farmland'] });
  }

  async findCropById(id: string): Promise<Crop> {
    const crop = await this.cropRepository.findOne({
      where: { id },
      relations: ['farmland'],
    });

    if (!crop) {
      throw new NotFoundException(`Cultura com ID '${id}' não encontrada.`);
    }
    return crop;
  }

  async updateCrop(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findCropById(id);

    if (updateCropDto.farmlandId) {
      const farmland = await this.farmlandsService.findFarmlandById(updateCropDto.farmlandId);
      crop.farmland = farmland;
    }

    if (updateCropDto.cropName !== undefined) {
      crop.cropName = updateCropDto.cropName;
    }
    if (updateCropDto.harvestSeason !== undefined) {
      crop.harvestSeason = updateCropDto.harvestSeason;
    }

    return this.cropRepository.save(crop);
  }

  async deleteCrop(id: string): Promise<void> {
    const crop = await this.findCropById(id);
    await this.cropRepository.remove(crop);
  }
}
