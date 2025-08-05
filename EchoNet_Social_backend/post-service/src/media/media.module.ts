import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { MediaRepository } from './media.repository';
import { Repository } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Media])
    ],
    controllers: [],
    providers: [MediaRepository],
    exports: [MediaRepository, TypeOrmModule.forFeature([Media])]
})
export class MediaModule { }
