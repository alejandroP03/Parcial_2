import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { ProfesorDto } from './profesor.dto/profesor.dto';
import { ProfesorEntity } from './profesor.entity/profesor.entity';

@Controller('profesor')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  async create(@Body() profesorDto: ProfesorDto) {
    const profesor = new ProfesorEntity();
    profesor.cedula = profesorDto.cedula;
    profesor.nombre = profesorDto.nombre;
    profesor.departamento = profesorDto.departamento;
    profesor.extension = profesorDto.extension;
    profesor.esParEvaluado = profesorDto.esParEvaluado;
    
    return this.profesorService.create(profesor);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.profesorService.findOne(id);
  }
}
