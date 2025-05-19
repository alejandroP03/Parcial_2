import { Test, TestingModule } from '@nestjs/testing';
import { ProfesorService } from './profesor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../utils/error';

describe('ProfesorService', () => {
  let service: ProfesorService;
  let repository: Repository<ProfesorEntity>;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfesorService,
        {
          provide: getRepositoryToken(ProfesorEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProfesorService>(ProfesorService);
    repository = module.get<Repository<ProfesorEntity>>(getRepositoryToken(ProfesorEntity));

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un profesor correctamente', async () => {
      const profesor = new ProfesorEntity();
      profesor.cedula = 12345678;
      profesor.nombre = 'John Doe';
      profesor.departamento = 1;
      profesor.extension = 10001;
      profesor.esParEvaluado = true;

      mockRepository.save.mockResolvedValue({ ...profesor, id: '1' });

      const result = await service.create(profesor);

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.extension).toBe(10001);
      expect(mockRepository.save).toHaveBeenCalledWith(profesor);
    });

    it('debe lanzar una excepción si la extensión tiene menos de 4 digitos', async () => {
      const profesor = new ProfesorEntity();
      profesor.cedula = 12345678;
      profesor.nombre = 'John Doe';
      profesor.departamento = 1;
      profesor.extension = 999;
      profesor.esParEvaluado = false;

      try {
        await service.create(profesor);
        fail('Se esperaba que se lanzara una excepción BusinessLogicException');
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('El profesor tiene una extensión incorrecta');
        expect(error.type).toBe(BusinessError.PRECONDITION_FAILED);
        expect(mockRepository.save).not.toHaveBeenCalled();
      }
    });
  });

  describe('findOne', () => {
    it('debe retornar un profesor por id', async () => {
      const profesor = new ProfesorEntity();
      profesor.id = '1';
      profesor.cedula = 12345678;
      profesor.nombre = 'John Doe';
      profesor.departamento = 1;
      profesor.extension = 10001;
      profesor.esParEvaluado = true;

      mockRepository.findOne.mockResolvedValue(profesor);

      const result = await service.findOne('1');
      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.nombre).toBe('John Doe');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['mentorias', 'evaluaciones'],
      });
    });

    it('debe lanzar una excepción si el profesor no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      try {
        await service.findOne('no-id');
        fail('Se esperaba que se lanzara una excepción BusinessLogicException');
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toBe('El profesor no existe');
        expect(error.type).toBe(BusinessError.NOT_FOUND);
      }
    });
  });
});