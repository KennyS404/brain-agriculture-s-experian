import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Farmland } from './entities/farmland.entity';
import { FarmlandsService } from './farmlands.service';
import { Repository } from 'typeorm';
import { ProducersService } from '../producers/producers.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Producer } from '../producers/entities/producer.entity';

const mockFarmlandRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
};

const mockProducersService = {
  findProducerById: jest.fn(),
};

describe('FarmlandsService', () => {
  let service: FarmlandsService;
  let farmlandRepo: Repository<Farmland>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmlandsService,
        {
          provide: getRepositoryToken(Farmland),
          useValue: mockFarmlandRepository,
        },
        {
          provide: ProducersService,
          useValue: mockProducersService,
        },
      ],
    }).compile();

    service = module.get<FarmlandsService>(FarmlandsService);
    farmlandRepo = module.get<Repository<Farmland>>(getRepositoryToken(Farmland));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createFarmland', () => {
    it('deve criar fazenda com sucesso se áreas estiverem corretas', async () => {
      mockProducersService.findProducerById.mockResolvedValue({ id: 'prod-123' } as Producer);

      const dto = {
        farmName: 'Fazenda Teste',
        city: 'Cidade X',
        state: 'Estado Y',
        totalAreaInHectares: 100,
        arableAreaInHectares: 60,
        vegetationAreaInHectares: 40,
        producerId: 'prod-123',
      };
      mockFarmlandRepository.create.mockReturnValue(dto);
      mockFarmlandRepository.save.mockResolvedValue({ id: 'farm-abc', ...dto });

      const result = await service.createFarmland(dto);

      expect(result).toHaveProperty('id', 'farm-abc');
      expect(mockFarmlandRepository.create).toHaveBeenCalledWith({
        ...dto,
        producer: { id: 'prod-123' },
      });
    });

    it('deve lançar BadRequestException se soma das áreas exceder total', async () => { // aqui eu garanto que não vai criar um registro se a soma da áreas agricultável e vegetação não ultrapasse a area total da fazenda 
      mockProducersService.findProducerById.mockResolvedValue({ id: 'prod-abc' } as Producer);

      const dto = {
        farmName: 'Fazenda Invalida',
        city: 'Cidade Z',
        state: 'Estado W',
        totalAreaInHectares: 100,
        arableAreaInHectares: 70,
        vegetationAreaInHectares: 40,
        producerId: 'prod-abc',
      };

      await expect(service.createFarmland(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findFarmlandById', () => {
    it('deve retornar NotFoundException se fazenda não existir', async () => {
      mockFarmlandRepository.findOne.mockResolvedValue(null);
      await expect(service.findFarmlandById('nao-existe')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateFarmland', () => {
    it('deve atualizar a fazenda se os dados forem válidos', async () => {
      const existingFarmland = {
        id: 'farm-123',
        totalAreaInHectares: 100,
        arableAreaInHectares: 60,
        vegetationAreaInHectares: 40,
      };
      mockFarmlandRepository.findOne.mockResolvedValue(existingFarmland);
      mockFarmlandRepository.save.mockResolvedValue({
        id: 'farm-123',
        totalAreaInHectares: 120,
        arableAreaInHectares: 60,
        vegetationAreaInHectares: 50,
      });

      const dto = {
        totalAreaInHectares: 120,
        arableAreaInHectares: 60,
        vegetationAreaInHectares: 50,
      };

      const result = await service.updateFarmland('farm-123', dto);
      expect(result.totalAreaInHectares).toBe(120);
      expect(mockFarmlandRepository.save).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se a soma das áreas for inválida no update', async () => {
      const existingFarmland = {
        id: 'farm-123',
        totalAreaInHectares: 100,
        arableAreaInHectares: 60,
        vegetationAreaInHectares: 40,
      };
      mockFarmlandRepository.findOne.mockResolvedValue(existingFarmland);

      const dto = {
        totalAreaInHectares: 100,
        arableAreaInHectares: 80,
        vegetationAreaInHectares: 30,
      };

      await expect(service.updateFarmland('farm-123', dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteFarmland', () => {
    it('deve remover fazenda se existir', async () => {
      const farmlandToRemove = { id: 'farm-remove' };
      mockFarmlandRepository.findOne.mockResolvedValue(farmlandToRemove);
      mockFarmlandRepository.remove.mockResolvedValue(undefined);

      await service.deleteFarmland('farm-remove');
      expect(mockFarmlandRepository.remove).toHaveBeenCalledWith(farmlandToRemove);
    });
  });
});
