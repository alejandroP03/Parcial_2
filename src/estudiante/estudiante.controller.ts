import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteDto } from './estudiante.dto/estudiante.dto';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async create(@Body() estudianteDto: EstudianteDto) {
    const estudiante = new EstudianteEntity();
    estudiante.cedula = estudianteDto.cedula;
    estudiante.nombre = estudianteDto.nombre;
    estudiante.semestre = estudianteDto.semestre;
    estudiante.programa = estudianteDto.programa;
    estudiante.promedio = estudianteDto.promedio;
    
    return this.estudianteService.create(estudiante);
  }

  @Get()
  async findAll() {
    return this.estudianteService.findAllEstudiantes();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.estudianteService.delete(id);
  }
}
