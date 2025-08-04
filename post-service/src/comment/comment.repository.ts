import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./comment.entity";
import { Repository } from "typeorm";
import { CommentCreateDto } from "./dto/comment-create.dto";

@Injectable()
export class CommentRepository {
    constructor(@InjectRepository(Comment) private readonly commentRepository: Repository<Comment>) { }

    async createComment(userId: number, commentCreateDto: CommentCreateDto, imageUrl: string | undefined): Promise<Comment> {

        const parentCommentId = commentCreateDto.parentCommentId;

        const parentComment = parentCommentId ? await this.commentRepository.findOne({
            where: {
                id: parentCommentId,
            },
            relations: {
                parent: {
                    parent: true,
                }
            }
        }) : null;

        if (parentCommentId && !parentComment) {
            throw new BadRequestException('Parent comment not found');
        }

        console.log('parentComment', parentComment);

        if (parentComment?.parent && parentComment?.parent.parent) throw new BadRequestException('Only up to 3 levels of comment nesting is allowed');

        const newComment = this.commentRepository.create({
            parent: {
                id: parentCommentId ? parentCommentId : undefined,
            },
            post: {
                id: commentCreateDto.postId,
            },
            content: commentCreateDto.content,
            userId: userId,
            imageUrl: imageUrl,
        })
        return await this.commentRepository.save(newComment);
    }
}