import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { BusinessError, BusinessLogicException } from '../utils/error';
import { ProyectoEntity } from '../proyecto/proyecto.entity/proyecto.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('EstudianteService', () => {
  let estudianteService: EstudianteService;
  let repository: Repository<EstudianteEntity>;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
        {
          provide: getRepositoryToken(EstudianteEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    estudianteService = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    
    jest.clearAllMocks();
  });

  it('debe crear un estudiante correctamente', async () => {
    const estudiante = new EstudianteEntity();
    estudiante.cedula = 12345678;
    estudiante.nombre = 'John Doe';
    estudiante.semestre = 5;
    estudiante.programa = 'Ingenieria de Software';
    estudiante.promedio = 4.5;

    mockRepository.save.mockResolvedValue({ ...estudiante, id: '1' });

    const result = await estudianteService.create(estudiante);

    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.cedula).toBe(12345678);
    expect(result.nombre).toBe('John Doe');
    expect(result.semestre).toBe(5);
    expect(result.programa).toBe('Ingenieria de Software');
    expect(result.promedio).toBe(4.5);
    expect(mockRepository.save).toHaveBeenCalledWith(estudiante);
  });

  it('debe lanzar una excepcion de precondicion cuando el promedio es menor a 3.2', async () => {
    const estudiante = new EstudianteEntity();
    estudiante.cedula = 12345678;
    estudiante.nombre = 'John Doe';
    estudiante.semestre = 5;
    estudiante.programa = 'Ingenieria de Software';
    estudiante.promedio = 3.1;

    try {
      await estudianteService.create(estudiante);
      fail('Se esperaba que se lanzara una excepción BusinessLogicException');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe('El estudiante no tiene el promedio requerido (más de 3.2)');
      expect(error.type).toBe(BusinessError.PRECONDITION_FAILED);
    }
  });

  it('debe eliminar un estudiante correctamente', async () => {
    const estudiante = new EstudianteEntity();
    estudiante.id = '1';
    estudiante.cedula = 12345678;
    estudiante.nombre = 'John Doe';
    estudiante.semestre = 5;
    estudiante.programa = 'Ingenieria de Software';
    estudiante.promedio = 4.5;
    estudiante.proyectos = [];

    mockRepository.findOne.mockResolvedValue(estudiante);
    mockRepository.remove.mockResolvedValue(estudiante);

    const result = await estudianteService.delete('1');

    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.cedula).toBe(12345678);
    expect(result.nombre).toBe('John Doe');
    expect(result.semestre).toBe(5);
    expect(result.programa).toBe('Ingenieria de Software');
    expect(result.promedio).toBe(4.5);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(mockRepository.remove).toHaveBeenCalledWith(estudiante);
  });

  it('debe lanzar una excepcion de precondicion cuando el estudiante tiene proyectos activos', async () => {
    const estudiante = new EstudianteEntity();
    estudiante.id = '1';
    estudiante.cedula = 12345678;
    estudiante.nombre = 'John Doe';
    estudiante.semestre = 5;
    estudiante.programa = 'Ingenieria de Software';
    estudiante.promedio = 4.5;
    
    const proyecto = new ProyectoEntity();
    proyecto.id = '1';
    estudiante.proyectos = [proyecto];

    mockRepository.findOne.mockResolvedValue(estudiante);

    try {
      await estudianteService.delete('1');
      fail('Se esperaba que se lanzara una excepción BusinessLogicException');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe('El estudiante no puede ser eliminado porque tiene proyectos activos');
      expect(error.type).toBe(BusinessError.PRECONDITION_FAILED);
      expect(mockRepository.remove).not.toHaveBeenCalled();
    }
  });

  it('debe obtener todos los estudiantes', async () => {
    const estudiantes = [
      { id: '1', cedula: 12345678, nombre: 'John Doe', semestre: 5, programa: 'Ingenieria de Software', promedio: 4.5 },
      { id: '2', cedula: 87654321, nombre: 'Jane Doe', semestre: 6, programa: 'Ingenieria de Sistemas', promedio: 4.2 }
    ];

    mockRepository.find.mockResolvedValue(estudiantes);

    const result = await estudianteService.findAllEstudiantes();

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
    expect(mockRepository.find).toHaveBeenCalled();
  });
});