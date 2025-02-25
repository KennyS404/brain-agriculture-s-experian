import { Injectable } from '@nestjs/common';
import { CropsService } from '../crops/crops.service';
import { FarmlandsService } from '../farmland/farmlands.service';
import { ProducersService } from '../producers/producers.service';


@Injectable()
export class DashboardService {
  constructor(
    private readonly farmlandsService: FarmlandsService,
    private readonly producersService: ProducersService,
    private readonly cropsService: CropsService,
  ) {}

  async getDashboardData() {
    const allFarmlands = await this.farmlandsService.findAllFarmlands();
    const totalFarms = allFarmlands.length;
    const totalHectares = allFarmlands.reduce((acc, farmland) => {
      return acc + Number(farmland.totalAreaInHectares);
    }, 0);

    const farmlandByState: Record<string, number> = {};
    for (const farmland of allFarmlands) {
      if (!farmlandByState[farmland.state]) {
        farmlandByState[farmland.state] = 0;
      }
      farmlandByState[farmland.state] += 1;
    }

    const totalArableArea = allFarmlands.reduce((acc, farmland) => {
      return acc + Number(farmland.arableAreaInHectares);
    }, 0);

    const totalVegetationArea = allFarmlands.reduce((acc, farmland) => {
      return acc + Number(farmland.vegetationAreaInHectares);
    }, 0);

    const allCrops = await this.cropsService.findAllCrops();
    const cropCountMap: Record<string, number> = {};
    for (const crop of allCrops) {
      if (!cropCountMap[crop.cropName]) {
        cropCountMap[crop.cropName] = 0;
      }
      cropCountMap[crop.cropName] += 1;
    }

    return {
      totalFarms,
      totalHectares,
      farmlandByState,
      totalArableArea,
      totalVegetationArea,
      cropCountMap,
    };
  }
}
