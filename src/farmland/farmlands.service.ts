import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Farmland } from './entities/farmland.entity';
import { CreateFarmlandDto } from './dto/create-farmland.dto';
import { UpdateFarmlandDto } from './dto/update-farmland.dto';
import { ProducersService } from '../producers/producers.service';

@Injectable()
export class FarmlandsService {
  constructor(
    @InjectRepository(Farmland)
    private readonly farmlandRepository: Repository<Farmland>,
    private readonly producersService: ProducersService,
  ) {}

  async createFarmland(createFarmlandDto: CreateFarmlandDto): Promise<Farmland> {
    const producer = await this.producersService.findProducerById(createFarmlandDto.producerId);

    const totalArea = createFarmlandDto.totalAreaInHectares;
    const sumOfArableAndVegetation =
      createFarmlandDto.arableAreaInHectares + createFarmlandDto.vegetationAreaInHectares;

    if (sumOfArableAndVegetation > totalArea) {
      throw new BadRequestException(
        'A soma da área agricultável e da área de vegetação não pode ultrapassar a área total da fazenda.',
      );
    }

    const newFarmland = this.farmlandRepository.create({
      ...createFarmlandDto,
      producer,
    });
    return this.farmlandRepository.save(newFarmland);
  }

  async findAllFarmlands(): Promise<Farmland[]> {
    return this.farmlandRepository.find({ relations: ['producer', 'crops'] });
  }

  async findFarmlandById(id: string): Promise<Farmland> {
    const farmland = await this.farmlandRepository.findOne({
      where: { id },
      relations: ['producer', 'crops'],
    });

    if (!farmland) {
      throw new NotFoundException(`Fazenda com ID '${id}' não encontrada.`);
    }
    return farmland;
  }

  async updateFarmland(id: string, updateFarmlandDto: UpdateFarmlandDto): Promise<Farmland> {
    const farmland = await this.findFarmlandById(id);

    if (
      updateFarmlandDto.arableAreaInHectares !== undefined ||
      updateFarmlandDto.vegetationAreaInHectares !== undefined ||
      updateFarmlandDto.totalAreaInHectares !== undefined
    ) {
      const totalArea =
        updateFarmlandDto.totalAreaInHectares !== undefined
          ? updateFarmlandDto.totalAreaInHectares
          : farmland.totalAreaInHectares;

      const arableArea =
        updateFarmlandDto.arableAreaInHectares !== undefined
          ? updateFarmlandDto.arableAreaInHectares
          : farmland.arableAreaInHectares;

      const vegetationArea =
        updateFarmlandDto.vegetationAreaInHectares !== undefined
          ? updateFarmlandDto.vegetationAreaInHectares
          : farmland.vegetationAreaInHectares;

      if (arableArea + vegetationArea > totalArea) {
        throw new BadRequestException(
          'A soma da área agricultável e da área de vegetação não pode ultrapassar a área total da fazenda.',
        );
      }
    }

    Object.assign(farmland, updateFarmlandDto);
    return this.farmlandRepository.save(farmland);
  }

  async deleteFarmland(id: string): Promise<void> {
    const farmland = await this.findFarmlandById(id);
    await this.farmlandRepository.remove(farmland);
  }
}
