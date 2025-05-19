import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../utils/error';
import { Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async create(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto < 0)
      throw new BusinessLogicException(
        'El proyecto no tiene el presupuesto necesario',
        BusinessError.PRECONDITION_FAILED,
      );
    if (proyecto.titulo.length < 15)
      throw new BusinessLogicException(
        'El proyecto tiene un título muy corto',
        BusinessError.PRECONDITION_FAILED,
      );

    return await this.proyectoRepository.save(proyecto);
  }

  async advance(id: string): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });

    if (!proyecto)
      throw new BusinessLogicException(
        'El proyecto no existe',
        BusinessError.NOT_FOUND,
      );
    if (proyecto.estado > 4)
      throw new BusinessLogicException(
        'El proyecto no puede alcanzar un estado más alto',
        BusinessError.PRECONDITION_FAILED,
      );
    proyecto.estado++;

    return await this.proyectoRepository.save(proyecto);
  }

  async findOne(id: string): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: ['mentor', 'evaluaciones'],
    });

    if (!proyecto)
      throw new BusinessLogicException(
        'El proyecto no existe',
        BusinessError.NOT_FOUND,
      );

    return proyecto;
  }
}
