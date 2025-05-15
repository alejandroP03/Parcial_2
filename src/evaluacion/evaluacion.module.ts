import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionController } from './evaluacion.controller';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';
import { ProfesorModule } from '../profesor/profesor.module';
import { ProyectoModule } from '../proyecto/proyecto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluacionEntity]),
    ProfesorModule,
    ProyectoModule
  ],
  providers: [EvaluacionService],
  controllers: [EvaluacionController],
  exports: [EvaluacionService]
})
export class EvaluacionModule {}
