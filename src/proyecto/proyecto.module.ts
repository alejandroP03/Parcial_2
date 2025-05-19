import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoService } from './proyecto.service';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { ProyectoController } from './proyecto.controller';
import { EstudianteModule } from '../estudiante/estudiante.module';
import { ProfesorModule } from '../profesor/profesor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProyectoEntity]),
    EstudianteModule,
    ProfesorModule
  ],
  providers: [ProyectoService],
  controllers: [ProyectoController],
  exports: [ProyectoService]
})
export class ProyectoModule {}
