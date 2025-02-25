import { Injectable, Logger } from '@nestjs/common';
import { ProducersService } from '../producers/producers.service';
import { CropsService } from '../crops/crops.service';
import { FarmlandsService } from '../farmland/farmlands.service';


@Injectable()
export class MockSeedsService {
  private readonly logger = new Logger(MockSeedsService.name);

  constructor(
    private readonly producersService: ProducersService,
    private readonly farmlandsService: FarmlandsService,
    private readonly cropsService: CropsService,
  ) {}

  async createMockData() {
    this.logger.log('Inserindo dados mockados de exemplo...');

    const producerOne = await this.producersService.createProducer({
      cpfOrCnpj: '11111111111',
      producerName: 'Produtor Exemplo Um',
    });

    const producerTwo = await this.producersService.createProducer({
      cpfOrCnpj: '22222222222222',
      producerName: 'Produtor Exemplo Dois',
    });

    const farmlandOne = await this.farmlandsService.createFarmland({
      farmName: 'Fazenda Bela Vista',
      city: 'Cidade A',
      state: 'Estado A',
      totalAreaInHectares: 100,
      arableAreaInHectares: 60,
      vegetationAreaInHectares: 40,
      producerId: producerOne.id,
    });

    const farmlandTwo = await this.farmlandsService.createFarmland({
      farmName: 'Fazenda Horizonte',
      city: 'Cidade B',
      state: 'Estado A',
      totalAreaInHectares: 200,
      arableAreaInHectares: 120,
      vegetationAreaInHectares: 80,
      producerId: producerOne.id,
    });

    const farmlandThree = await this.farmlandsService.createFarmland({
      farmName: 'Fazenda Tio João',
      city: 'Cidade C',
      state: 'Estado B',
      totalAreaInHectares: 150,
      arableAreaInHectares: 70,
      vegetationAreaInHectares: 80,
      producerId: producerTwo.id,
    });
    await this.cropsService.createCrop({
      cropName: 'Soja',
      harvestSeason: 'Safra 2021',
      farmlandId: farmlandOne.id,
    });

    await this.cropsService.createCrop({
      cropName: 'Milho',
      harvestSeason: 'Safra 2021',
      farmlandId: farmlandOne.id,
    });

    await this.cropsService.createCrop({
      cropName: 'Café',
      harvestSeason: 'Safra 2022',
      farmlandId: farmlandTwo.id,
    });

    await this.cropsService.createCrop({
      cropName: 'Milho',
      harvestSeason: 'Safra 2022',
      farmlandId: farmlandThree.id,
    });

    this.logger.log('Dados mockados inseridos com sucesso!');
  }
}
