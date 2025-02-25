import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async createProducer(createProducerDto: CreateProducerDto): Promise<Producer> {
    const existingProducer = await this.producerRepository.findOne({
      where: { cpfOrCnpj: createProducerDto.cpfOrCnpj },
    });
    if (existingProducer) {
      throw new BadRequestException('CPF ou CNPJ já está cadastrado.');
    }

    const newProducer = this.producerRepository.create(createProducerDto);
    return this.producerRepository.save(newProducer);
  }

  async findAllProducers(): Promise<Producer[]> {
    return this.producerRepository.find({ relations: ['farmlands'] });
  }

  async findProducerById(id: string): Promise<Producer> {
    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: ['farmlands'],
    });

    if (!producer) {
      throw new NotFoundException(`Produtor com ID '${id}' não encontrado.`);
    }
    return producer;
  }

  async updateProducer(id: string, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    const producer = await this.findProducerById(id);
    if (updateProducerDto.cpfOrCnpj && updateProducerDto.cpfOrCnpj !== producer.cpfOrCnpj) {
      const existingProducer = await this.producerRepository.findOne({
        where: { cpfOrCnpj: updateProducerDto.cpfOrCnpj },
      });
      if (existingProducer) {
        throw new BadRequestException('Já existe um produtor com este CPF ou CNPJ.');
      }
    }

    Object.assign(producer, updateProducerDto);
    return this.producerRepository.save(producer);
  }

  async deleteProducer(id: string): Promise<void> {
    const producer = await this.findProducerById(id);
    await this.producerRepository.remove(producer);
  }
}
