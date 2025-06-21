import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionRepository } from './reaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './reaction.entity';
import { ReactionController } from './reaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reaction]),
  ],
  providers: [ReactionService, ReactionRepository],
  exports: [ReactionService, ReactionRepository],
  controllers: [ReactionController],
})
export class ReactionModule { }
