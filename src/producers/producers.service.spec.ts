import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';
import { ProducersService } from './producers.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockProducerRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
};

describe('ProducersService', () => {
  let service: ProducersService;
  let repository: Repository<Producer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: getRepositoryToken(Producer),
          useValue: mockProducerRepository,
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    repository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createProducer', () => {
    it('deve criar um novo produtor', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null); 
      mockProducerRepository.create.mockReturnValue({
        cpfOrCnpj: '12345678901',
        producerName: 'Teste',
      });
      mockProducerRepository.save.mockResolvedValue({
        id: 'uuid-123',
        cpfOrCnpj: '12345678901',
        producerName: 'Teste',
      });

      const result = await service.createProducer({
        cpfOrCnpj: '12345678901',
        producerName: 'Teste',
      });

      expect(result).toHaveProperty('id');
      expect(result.cpfOrCnpj).toBe('12345678901');
      expect(mockProducerRepository.create).toHaveBeenCalledWith({
        cpfOrCnpj: '12345678901',
        producerName: 'Teste',
      });
      expect(mockProducerRepository.save).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se CPF/CNPJ já existir', async () => {
      mockProducerRepository.findOne.mockResolvedValue({ id: 'existe' });
      await expect(
        service.createProducer({
          cpfOrCnpj: '11111111111',
          producerName: 'Produtor já cadastrado',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findProducerById', () => {
    it('deve retornar NotFoundException se o produtor não existir', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null);

      await expect(service.findProducerById('inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve retornar o produtor se ID existir', async () => {
      const mockProducer = {
        id: 'existente',
        cpfOrCnpj: '12345678901',
        producerName: 'Produtor Existente',
        farmlands: [],
      };
      mockProducerRepository.findOne.mockResolvedValue(mockProducer);

      const result = await service.findProducerById('existente');
      expect(result).toEqual(mockProducer);
    });
  });

  describe('updateProducer', () => {
    it('deve lançar BadRequestException se tentar atualizar CPF/CNPJ para um já existente', async () => {
      const existingProducer = {
        id: 'uuid-abc',
        cpfOrCnpj: '12345678901',
        producerName: 'Produtor Original',
      };
      const anotherProducerWithSameCpf = {
        id: 'uuid-diferente',
        cpfOrCnpj: '99999999999',
        producerName: 'Outro Produtor',
      };

      mockProducerRepository.findOne
        .mockResolvedValueOnce(existingProducer) // findProducerById
        .mockResolvedValueOnce(anotherProducerWithSameCpf); // findOne com o cpfOrCnpj do update

      await expect(
        service.updateProducer('uuid-abc', {
          cpfOrCnpj: '99999999999',
          producerName: 'Novo Nome',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteProducer', () => {
    it('deve lançar NotFoundException se tentar excluir produtor inexistente', async () => {
      mockProducerRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteProducer('uuid-invalido')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve remover produtor existente', async () => {
      const producerToRemove = {
        id: 'uuid-abc',
        cpfOrCnpj: '12345678901',
        producerName: 'Produtor Removido',
      };
      mockProducerRepository.findOne.mockResolvedValue(producerToRemove);
      mockProducerRepository.remove.mockResolvedValue(undefined);

      await service.deleteProducer('uuid-abc');
      expect(mockProducerRepository.remove).toHaveBeenCalledWith(producerToRemove);
    });
  });
});
