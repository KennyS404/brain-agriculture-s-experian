import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';

@ApiTags('Crops')
@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova cultura (ex.: Soja na safra 2021)' })
  createCrop(@Body() createCropDto: CreateCropDto): Promise<Crop> {
    return this.cropsService.createCrop(createCropDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as culturas cadastradas' })
  findAllCrops(): Promise<Crop[]> {
    return this.cropsService.findAllCrops();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma cultura pelo ID' })
  findCropById(@Param('id') id: string): Promise<Crop> {
    return this.cropsService.findCropById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de uma cultura pelo ID' })
  updateCrop(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto): Promise<Crop> {
    return this.cropsService.updateCrop(id, updateCropDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui uma cultura pelo ID' })
  deleteCrop(@Param('id') id: string): Promise<void> {
    return this.cropsService.deleteCrop(id);
  }
}
