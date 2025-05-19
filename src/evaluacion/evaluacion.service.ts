import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';
import { BusinessError, BusinessLogicException } from '../utils/error';
import { ProyectoEntity } from '../proyecto/proyecto.entity/proyecto.entity';
import { ProfesorEntity } from '../profesor/profesor.entity/profesor.entity';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
  ) {}

  async crearEvaluacion(
    evaluacion: EvaluacionEntity,
    proyecto: ProyectoEntity,
    evaluador: ProfesorEntity,
  ): Promise<EvaluacionEntity> {
    if (evaluador.id === proyecto.mentor.id) {
      throw new BusinessLogicException(
        'El evaluador no puede ser el mismo que el mentor del proyecto',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (evaluacion.calificacion < 0 || evaluacion.calificacion > 5) {
      throw new BusinessLogicException(
        'La calificación debe estar entre 0 y 5',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.evaluacionRepository.save(evaluacion);
  }
}
