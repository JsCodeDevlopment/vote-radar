import { Module } from '@nestjs/common';
import { PoliticiansController } from './politicians.controller';
import { RealDataService } from './real-data.service';

@Module({
  controllers: [PoliticiansController],
  providers: [RealDataService],
  exports: [RealDataService],
})
export class PoliticiansModule {}
