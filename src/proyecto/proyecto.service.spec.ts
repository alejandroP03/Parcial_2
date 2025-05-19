import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoService } from './proyecto.service';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { BusinessError, BusinessLogicException } from '../utils/error';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let repository: Repository<ProyectoEntity>;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoService,
        {
          provide: getRepositoryToken(ProyectoEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
    repository = module.get<Repository<ProyectoEntity>>(getRepositoryToken(ProyectoEntity));
    
    jest.clearAllMocks();
  });

  it('debe crear un proyecto correctamente', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.titulo = 'University Test Project';
    proyecto.area = 'Computer Science';
    proyecto.presupuesto = 1000;
    
    mockRepository.save.mockResolvedValue({ ...proyecto, id: '1' });
    
    const result = await service.create(proyecto);
    
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.titulo).toBe('University Test Project');
    expect(result.area).toBe('Computer Science');
    expect(result.presupuesto).toBe(1000);
    expect(mockRepository.save).toHaveBeenCalledWith(proyecto);
  });

  it('debe lanzar una excepcion de precondicion cuando el presupuesto es menor a 0', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.titulo = 'University Test Project';
    proyecto.area = 'Computer Science';
    proyecto.presupuesto = -1000;
    
    try {
      await service.create(proyecto);
      fail('Se esperaba que se lanzara una excepción BusinessLogicException');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe('El proyecto no tiene el presupuesto necesario');
      expect(error.type).toBe(BusinessError.PRECONDITION_FAILED);
    }
  });

  it('debe cambiar el estado del proyecto correctamente', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.id = '1';
    proyecto.titulo = 'University Test Project';
    proyecto.area = 'Computer Science';
    proyecto.presupuesto = 1000;
    proyecto.estado = 1;
    
    mockRepository.findOne.mockResolvedValue(proyecto);
    mockRepository.save.mockResolvedValue({ ...proyecto, estado: 2 });
    
    const result = await service.advance('1');
    
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.titulo).toBe('University Test Project');
    expect(result.area).toBe('Computer Science');
    expect(result.presupuesto).toBe(1000);
    expect(result.estado).toBe(2);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('debe lanzar una excepcion de precondicion cuando el estado es mayor a 4', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.id = '1';
    proyecto.titulo = 'University Test Project';
    proyecto.area = 'Computer Science';
    proyecto.presupuesto = 1000;
    proyecto.estado = 5;
    
    mockRepository.findOne.mockResolvedValue(proyecto);
    
    try {
      await service.advance('1');
      fail('Se esperaba que se lanzara una excepción BusinessLogicException');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe('El proyecto no puede alcanzar un estado más alto');
      expect(error.type).toBe(BusinessError.PRECONDITION_FAILED);
      expect(mockRepository.save).not.toHaveBeenCalled();
    }
  });

  it('debe encontrar un proyecto por id', async () => {
    const proyecto = new ProyectoEntity();
    proyecto.id = '1';
    proyecto.titulo = 'University Test Project';
    proyecto.area = 'Computer Science';
    proyecto.presupuesto = 1000;
    proyecto.estado = 1;
    await service.create(proyecto);
    mockRepository.findOne.mockResolvedValue(proyecto);
    
    const result = await service.findOne('1');
    
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.titulo).toBe('University Test Project');
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['mentor', 'evaluaciones']
    });
  });

  it('debe lanzar una excepción si el proyecto no existe', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    
    try {
      await service.findOne('999');
      fail('Se esperaba que se lanzara una excepción BusinessLogicException');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe('El proyecto no existe');
      expect(error.type).toBe(BusinessError.NOT_FOUND);
    }
  });


});