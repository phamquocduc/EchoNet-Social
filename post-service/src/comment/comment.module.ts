import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentController } from './comment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment])
  ],
  providers: [CommentService, CommentRepository],
  exports: [CommentService, CommentRepository],
  controllers: [CommentController],
})
export class CommentModule { }
