import { EstudianteEntity } from '../../estudiante/estudiante.entity/estudiante.entity';
import { EvaluacionEntity } from '../../evaluacion/evaluacion.entity/evaluacion.entity';
import { ProfesorEntity } from '../../profesor/profesor.entity/profesor.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProyectoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column()
  area: string;

  @Column()
  presupuesto: number;

  @Column()
  nota_final: number;

  @Column()
  estado: number;

  @Column()
  fecha_inicio: string;

  @Column()
  fecha_fin: string;

  @ManyToOne(() => EstudianteEntity, (estudiante) => estudiante.proyectos)
  lider: EstudianteEntity;

  @ManyToOne(() => ProfesorEntity, (profesor) => profesor.mentorias)
  mentor: ProfesorEntity;

  @OneToMany(() => EvaluacionEntity, (evaluacion) => evaluacion.proyecto)
  evaluaciones: EvaluacionEntity[];
}
