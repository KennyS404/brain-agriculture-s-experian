import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from './entities/producer.entity';

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo produtor rural' })
  createProducer(@Body() createProducerDto: CreateProducerDto): Promise<Producer> {
    return this.producersService.createProducer(createProducerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os produtores rurais' })
  findAllProducers(): Promise<Producer[]> {
    return this.producersService.findAllProducers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um produtor rural pelo ID' })
  findProducerById(@Param('id') id: string): Promise<Producer> {
    return this.producersService.findProducerById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um produtor rural pelo ID' })
  updateProducer(
    @Param('id') id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ): Promise<Producer> {
    return this.producersService.updateProducer(id, updateProducerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um produtor rural pelo ID' })
  deleteProducer(@Param('id') id: string): Promise<void> {
    return this.producersService.deleteProducer(id);
  }
}
