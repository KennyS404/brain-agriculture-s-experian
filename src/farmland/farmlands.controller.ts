import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FarmlandsService } from './farmlands.service';
import { CreateFarmlandDto } from './dto/create-farmland.dto';
import { UpdateFarmlandDto } from './dto/update-farmland.dto';
import { Farmland } from './entities/farmland.entity';

@ApiTags('Farmlands')
@Controller('farmlands')
export class FarmlandsController {
  constructor(private readonly farmlandsService: FarmlandsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova fazenda (propriedade rural)' })
  createFarmland(@Body() createFarmlandDto: CreateFarmlandDto): Promise<Farmland> {
    return this.farmlandsService.createFarmland(createFarmlandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as fazendas cadastradas' })
  findAllFarmlands(): Promise<Farmland[]> {
    return this.farmlandsService.findAllFarmlands();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma fazenda pelo ID' })
  findFarmlandById(@Param('id') id: string): Promise<Farmland> {
    return this.farmlandsService.findFarmlandById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de uma fazenda pelo ID' })
  updateFarmland(
    @Param('id') id: string,
    @Body() updateFarmlandDto: UpdateFarmlandDto,
  ): Promise<Farmland> {
    return this.farmlandsService.updateFarmland(id, updateFarmlandDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui uma fazenda pelo ID' })
  deleteFarmland(@Param('id') id: string): Promise<void> {
    return this.farmlandsService.deleteFarmland(id);
  }
}
