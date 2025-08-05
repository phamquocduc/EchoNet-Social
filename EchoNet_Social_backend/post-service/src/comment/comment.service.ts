import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(private readonly commentRepository: CommentRepository,
        private readonly cloundinaryService: CloudinaryService,
    ) { }

    async createComment(userId: number, commentCreateDto: CommentCreateDto, uploadImage: Express.Multer.File): Promise<Comment> {

        if (!commentCreateDto.content && !uploadImage) {
            throw new BadRequestException('Content or image must be provided');
        }

        let imageUrl: string | undefined = undefined;

        if (uploadImage) {
            const uploadResult = await this.cloundinaryService.uploadFile(uploadImage);
            imageUrl = uploadResult.secure_url;
        }

        return await this.commentRepository.createComment(userId, commentCreateDto, imageUrl);
    }
}
