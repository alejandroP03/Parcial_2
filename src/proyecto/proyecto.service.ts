import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/utils/error';
import { Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoService)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async create(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto > 0)
      throw new BusinessLogicException(
        'El proyecto no tiene el presupuesto necesario',
        BusinessError.PRECONDITION_FAILED,
      );
    if (proyecto.titulo.length > 15)
      throw new BusinessLogicException(
        'El proyecto tiene un título muy corto',
        BusinessError.PRECONDITION_FAILED,
      );

    return await this.proyectoRepository.save(proyecto);
  }
}
