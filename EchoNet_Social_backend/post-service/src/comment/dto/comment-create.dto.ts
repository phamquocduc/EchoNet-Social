import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CommentCreateDto {
    @Type(() => Number)
    @IsNumber()
    postId: number;

    @IsString()
    @IsOptional()
    content?: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    parentCommentId?: number;
}