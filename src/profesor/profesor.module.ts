import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfesorService } from './profesor.service';
import { ProfesorEntity } from './profesor.entity/profesor.entity';
import { ProfesorController } from './profesor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProfesorEntity])],
  providers: [ProfesorService],
  exports: [ProfesorService],
  controllers: [ProfesorController]
})
export class ProfesorModule {}
