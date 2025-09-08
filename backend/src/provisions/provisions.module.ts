import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvisionsController } from './provisions.controller';
import { ProvisionsService } from './provisions.service';
import { Provision } from './entities/provision.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Provision, User])],
  controllers: [ProvisionsController],
  providers: [ProvisionsService],
  exports: [ProvisionsService]
})
export class ProvisionsModule {}