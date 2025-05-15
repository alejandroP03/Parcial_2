import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ProfesorModule } from './profesor/profesor.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';

@Module({
  imports: [EstudianteModule, ProfesorModule, ProyectoModule, EvaluacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
