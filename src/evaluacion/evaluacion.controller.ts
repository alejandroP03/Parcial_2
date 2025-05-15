import { Body, Controller, Post } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { ProfesorService } from '../profesor/profesor.service';
import { ProyectoService } from '../proyecto/proyecto.service';
import { EvaluacionEntity } from './evaluacion.entity/evaluacion.entity';
import { EvaluacionDto } from './evaluacion.dto/evaluacion.dto';

@Controller('evaluacion')
export class EvaluacionController {
  constructor(
    private readonly evaluacionService: EvaluacionService,
    private readonly profesorService: ProfesorService,
    private readonly proyectoService: ProyectoService,
  ) {}

  @Post()
  async crearEvaluacion(@Body() evaluacionDto: EvaluacionDto) {
    const proyecto = await this.proyectoService.findOne(evaluacionDto.proyectoId);
    const evaluador = await this.profesorService.findOne(evaluacionDto.evaluadorId);
    
    const evaluacion = new EvaluacionEntity();
    evaluacion.calificacion = evaluacionDto.calificacion;
    evaluacion.proyecto = proyecto;
    evaluacion.profesor = evaluador;
    
    return this.evaluacionService.crearEvaluacion(
      evaluacion,
      proyecto,
      evaluador,
    );
  }
}
