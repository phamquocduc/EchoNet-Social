export class PostCreateRequestDto {
    title: string;
    content: string;
    imageUrl?: string; // Optional field for image URL
    tags?: string[]; // Optional field for tags
    isPublic: boolean; // Indicates if the post is public or private
}