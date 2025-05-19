import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoDto } from './proyecto.dto/proyecto.dto';
import { ProyectoEntity } from './proyecto.entity/proyecto.entity';
import { EstudianteService } from '../estudiante/estudiante.service';
import { ProfesorService } from '../profesor/profesor.service';

@Controller('proyecto')
export class ProyectoController {
  constructor(
    private readonly proyectoService: ProyectoService,
    private readonly estudianteService: EstudianteService,
    private readonly profesorService: ProfesorService,
  ) {}

  @Post()
  async create(@Body() proyectoDto: ProyectoDto) {
    const lider = await this.estudianteService.findOne(proyectoDto.liderId);
    if (!lider) {
      throw new Error(`Estudiante con ID ${proyectoDto.liderId} no encontrado`);
    }
    
    const mentor = await this.profesorService.findOne(proyectoDto.mentorId);
    
    const proyecto = new ProyectoEntity();
    proyecto.titulo = proyectoDto.titulo;
    proyecto.area = proyectoDto.area;
    proyecto.presupuesto = proyectoDto.presupuesto;
    proyecto.fecha_inicio = proyectoDto.fecha_inicio;
    proyecto.fecha_fin = proyectoDto.fecha_fin;
    proyecto.estado = 1; // Estado inicial
    proyecto.nota_final = 0; // Nota inicial
    proyecto.lider = lider;
    proyecto.mentor = mentor;
    
    return this.proyectoService.create(proyecto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.proyectoService.findOne(id);
  }

  @Put(':id/advance')
  async advance(@Param('id') id: string) {
    return this.proyectoService.advance(id);
  }
}
