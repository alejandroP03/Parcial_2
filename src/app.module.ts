import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ProfesorModule } from './profesor/profesor.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { EvaluacionModule } from './evaluacion/evaluacion.module';
import { EstudianteEntity } from './estudiante/estudiante.entity/estudiante.entity';
import { ProfesorEntity } from './profesor/profesor.entity/profesor.entity';
import { ProyectoEntity } from './proyecto/proyecto.entity/proyecto.entity';
import { EvaluacionEntity } from './evaluacion/evaluacion.entity/evaluacion.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [EstudianteEntity, ProfesorEntity, ProyectoEntity, EvaluacionEntity],
      synchronize: true,
      dropSchema: true,
    }),
    EstudianteModule,
    ProfesorModule,
    ProyectoModule,
    EvaluacionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
