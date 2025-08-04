import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EMediaType } from 'src/enum/media-type.enum';
import { Media } from 'src/media/media.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/creat-post.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PostRepository } from './post.repository';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
        private readonly cloudinaryService: CloudinaryService,
        private readonly postRepository: PostRepository,
    ) { }

    async create(userId: number, dto: CreatePostDto, files: Express.Multer.File[]) {

        if (!dto.content && !files) {
            throw new BadRequestException('Content or files must be provided');
        }

        const uploadedMedia: Media[] = [];

        for (const file of files) {
            const uploadResult = await this.cloudinaryService.uploadFile(file);

            const media = this.mediaRepository.create({
                url: uploadResult.secure_url,
                type: uploadResult.resource_type === 'video' ? EMediaType.VIDEO : EMediaType.IMAGE,
            });

            uploadedMedia.push(media);
        }

        const post = await this.postRepository.createPost(
            userId,
            dto.content || '',
            uploadedMedia,
        );

        return post
    }

    async findAll(userId: number): Promise<PostEntity[] | null> {
        return await this.postRepository.findAll(userId);
    }
}
