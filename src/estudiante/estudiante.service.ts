import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../utils/error';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async create(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    if (estudiante.promedio <= 3.2)
      throw new BusinessLogicException(
        'El estudiante no tiene el promedio requerido (más de 3.2)',
        BusinessError.PRECONDITION_FAILED,
      );
    else if (estudiante.semestre < 4)
      throw new BusinessLogicException(
        'El estudiante está en tercer semestre o inferior',
        BusinessError.PRECONDITION_FAILED,
      );

    return await this.estudianteRepository.save(estudiante);
  }

  async delete(id: string): Promise<EstudianteEntity> {
    const student = await this.estudianteRepository.findOne({ where: { id } });

    if (!student)
      throw new BusinessLogicException(
        'El estudiante no existe',
        BusinessError.NOT_FOUND,
      );
    else if (student.proyectos.length > 0)
      throw new BusinessLogicException(
        'El estudiante no puede ser eliminado porque tiene proyectos activos',
        BusinessError.PRECONDITION_FAILED,
      );
    else this.estudianteRepository.remove(student);

    return student;
  }

  async findAllEstudiantes(): Promise<EstudianteEntity[]> {
    return await this.estudianteRepository.find();
  }
}
