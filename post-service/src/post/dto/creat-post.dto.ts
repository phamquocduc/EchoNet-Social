import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {

  @IsString()
  @IsOptional()
  content?: string;
}
