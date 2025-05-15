import { Module } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';

@Module({
  providers: [EvaluacionService]
})
export class EvaluacionModule {}
