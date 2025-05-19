import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';
import { ProyectoEntity } from '../proyecto/proyecto.entity/proyecto.entity';
import { ProfesorEntity } from '../profesor/profesor.entity/profesor.entity';
import { BusinessError, BusinessLogicException } from '../utils/error';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('EvaluacionService', () => {
  let service: EvaluacionService;
  let repository: Repository<EvaluacionEntity>;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluacionService,
        {
          provide: getRepositoryToken(EvaluacionEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
    repository = module.get<Repository<EvaluacionEntity>>(getRepositoryToken(EvaluacionEntity));
    
    jest.clearAllMocks();
  });

  it('debe crear una evaluacion correctamente', async () => {
    const evaluacion = new EvaluacionEntity();
    evaluacion.calificacion = 4.5;
    
    const proyecto = new ProyectoEntity();
    proyecto.id = '1';
    
    const evaluador = new ProfesorEntity();
    evaluador.id = '1';
    
    const mentor = new ProfesorEntity();
    mentor.id = '2';
    
    proyecto.mentor = mentor;
    
    mockRepository.save.mockResolvedValue({ ...evaluacion, id: '1', proyecto, profesor: evaluador });
    
    const result = await service.crearEvaluacion(evaluacion, proyecto, evaluador);
    
    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.calificacion).toBe(4.5);
    expect(result.proyecto).toBe(proyecto);
    expect(result.profesor).toBe(evaluador);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('debe lanzar una excepcion de precondicion cuando el evaluador es el mismo que el mentor', async () => {
    const evaluacion = new EvaluacionEntity();
    evaluacion.calificacion = 4.5;
    
    const proyecto = new ProyectoEntity();
    proyecto.id = '1';
    
    const evaluador = new ProfesorEntity();
    evaluador.id = '1';
    
    const mentor = new ProfesorEntity();
    mentor.id = '1';
    
    proyecto.mentor = mentor;
    
    try {
      await service.crearEvaluacion(evaluacion, proyecto, evaluador);
      fail('Se esperaba que se lanzara una excepción BusinessLogicException');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe('El evaluador no puede ser el mismo que el mentor del proyecto');
      expect(error.type).toBe(BusinessError.PRECONDITION_FAILED);
    }
  });
  
  it('debe lanzar una excepcion de precondicion cuando la calificacion esta fuera de rango', async () => {
    const evaluacion = new EvaluacionEntity();
    evaluacion.calificacion = 6; // Fuera del rango 0-5
    
    const proyecto = new ProyectoEntity();
    proyecto.id = '1';
    
    const evaluador = new ProfesorEntity();
    evaluador.id = '1';
    
    const mentor = new ProfesorEntity();
    mentor.id = '2';
    
    proyecto.mentor = mentor;
    
    try {
      await service.crearEvaluacion(evaluacion, proyecto, evaluador);
      fail('Se esperaba que se lanzara una excepción BusinessLogicException');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toBe('La calificación debe estar entre 0 y 5');
      expect(error.type).toBe(BusinessError.PRECONDITION_FAILED);
    }
  });
});