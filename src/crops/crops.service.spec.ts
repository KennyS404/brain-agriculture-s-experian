import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CropsService } from './crops.service';
import { Crop } from './entities/crop.entity';
import { FarmlandsService } from '../farmland/farmlands.service';
import { NotFoundException } from '@nestjs/common';

const mockCropRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
};

const mockFarmlandsService = {
  findFarmlandById: jest.fn(),
};

describe('CropsService', () => {
  let service: CropsService;
  let cropRepository: Repository<Crop>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropsService,
        {
          provide: getRepositoryToken(Crop),
          useValue: mockCropRepository,
        },
        {
          provide: FarmlandsService,
          useValue: mockFarmlandsService,
        },
      ],
    }).compile();

    service = module.get<CropsService>(CropsService);
    cropRepository = module.get<Repository<Crop>>(getRepositoryToken(Crop));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCrop', () => {
    it('deve criar uma cultura com sucesso se a fazenda existir', async () => {
      const farmlandMock = { id: 'farm-123' };
      mockFarmlandsService.findFarmlandById.mockResolvedValue(farmlandMock);

      const dto = {
        cropName: 'Soja',
        harvestSeason: 'Verão 2025',
        farmlandId: 'farm-123',
      };

      const createdCrop = {
        ...dto,
        farmland: farmlandMock,
      };

      mockCropRepository.create.mockReturnValue(createdCrop);
      mockCropRepository.save.mockResolvedValue({ id: 'crop-abc', ...createdCrop });

      const result = await service.createCrop(dto);

      expect(result).toHaveProperty('id', 'crop-abc');
      expect(mockCropRepository.create).toHaveBeenCalledWith({
        ...dto,
        farmland: farmlandMock,
      });
    });
  });

  describe('findAllCrops', () => {
    it('deve retornar todas as culturas', async () => {
      const crops = [
        { id: 'crop-1', cropName: 'Soja', harvestSeason: 'Verão 2025', farmland: { id: 'farm-1' } },
        { id: 'crop-2', cropName: 'Milho', harvestSeason: 'Inverno 2025', farmland: { id: 'farm-2' } },
      ];

      mockCropRepository.find.mockResolvedValue(crops);

      const result = await service.findAllCrops();

      expect(result).toEqual(crops);
      expect(mockCropRepository.find).toHaveBeenCalledWith({ relations: ['farmland'] });
    });
  });

  describe('findCropById', () => {
    it('deve retornar uma cultura se ela existir', async () => {
      const crop = {
        id: 'crop-123',
        cropName: 'Soja',
        harvestSeason: 'Verão 2025',
        farmland: { id: 'farm-123' },
      };

      mockCropRepository.findOne.mockResolvedValue(crop);

      const result = await service.findCropById('crop-123');

      expect(result).toEqual(crop);
    });

    it('deve lançar NotFoundException se a cultura não for encontrada', async () => {
      mockCropRepository.findOne.mockResolvedValue(null);

      await expect(service.findCropById('inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('registro de múltiplas culturas para a mesma fazenda', () => {
    it('deve permitir criar múltiplas culturas associadas à mesma fazenda', async () => {

      const farmland = { id: 'farm-123' };
      mockFarmlandsService.findFarmlandById.mockResolvedValue(farmland);
  
      const cropDto1 = {
        cropName: 'Soja',
        harvestSeason: 'Verão 2025',
        farmlandId: 'farm-123',
      };
  
      const cropDto2 = {
        cropName: 'Milho',
        harvestSeason: 'Inverno 2025',
        farmlandId: 'farm-123',
      };

      mockCropRepository.create.mockImplementation((dto) => ({ ...dto, farmland }));

      let callCount = 0;
      mockCropRepository.save.mockImplementation((crop) => {
        callCount++;
        return { ...crop, id: `crop-${callCount}` };
      });
  
      const result1 = await service.createCrop(cropDto1);
      const result2 = await service.createCrop(cropDto2);
  
      expect(result1.farmland.id).toBe('farm-123');
      expect(result2.farmland.id).toBe('farm-123');
      expect(result1.cropName).toBe('Soja');
      expect(result2.cropName).toBe('Milho');
      expect(result1.id).not.toBe(result2.id);
    });
  });
  

  describe('updateCrop', () => {
    it('deve atualizar uma cultura existente', async () => {
      const existingCrop = {
        id: 'crop-123',
        cropName: 'Soja',
        harvestSeason: 'Verão 2025',
        farmland: { id: 'farm-123' },
      };

      mockCropRepository.findOne.mockResolvedValue(existingCrop);

      const dto = { cropName: 'Milho', harvestSeason: 'Inverno 2025' };

      const updatedCrop = { ...existingCrop, ...dto };

      mockCropRepository.save.mockResolvedValue(updatedCrop);

      const result = await service.updateCrop('crop-123', dto);

      expect(result.cropName).toBe('Milho');
      expect(result.harvestSeason).toBe('Inverno 2025');
      expect(mockCropRepository.save).toHaveBeenCalled();
    });

    it('deve atualizar o campo farmland se farmlandId for fornecido', async () => {
      const existingCrop = {
        id: 'crop-123',
        cropName: 'Soja',
        harvestSeason: 'Verão 2025',
        farmland: { id: 'farm-123' },
      };

      mockCropRepository.findOne.mockResolvedValue(existingCrop);

      const newFarmland = { id: 'farm-456' };
      mockFarmlandsService.findFarmlandById.mockResolvedValue(newFarmland);

      const dto = { farmlandId: 'farm-456', cropName: 'Soja Updated' };

      const updatedCrop = { ...existingCrop, cropName: 'Soja Updated', farmland: newFarmland };

      mockCropRepository.save.mockResolvedValue(updatedCrop);

      const result = await service.updateCrop('crop-123', dto);

      expect(result.farmland.id).toBe('farm-456');
      expect(result.cropName).toBe('Soja Updated');
    });
  });

  describe('deleteCrop', () => {
    it('deve remover uma cultura existente', async () => {
      const cropToRemove = { id: 'crop-123' };

      mockCropRepository.findOne.mockResolvedValue(cropToRemove);
      mockCropRepository.remove.mockResolvedValue(undefined);

      await service.deleteCrop('crop-123');

      expect(mockCropRepository.remove).toHaveBeenCalledWith(cropToRemove);
    });
  });
});
