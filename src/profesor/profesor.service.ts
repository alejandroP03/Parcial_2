import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/utils/error';
import { Repository } from 'typeorm';
import { ProfesorEntity } from './profesor.entity/profesor.entity';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,
  ) {}

  async create(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    if (profesor.extension <= 9999)
      throw new BusinessLogicException(
        'El profesor tiene una extensión incorrecta',
        BusinessError.PRECONDITION_FAILED,
      );

    return await this.profesorRepository.save(profesor);
  }
}
