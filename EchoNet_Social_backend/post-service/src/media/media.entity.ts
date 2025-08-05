import { EMediaType } from "src/enum/media-type.enum";
import { PostEntity } from "src/post/post.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Media {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({
        type: 'enum',
        enum: EMediaType,
    })
    type: EMediaType;

    @ManyToOne(() => PostEntity, post => post.media)
    post: PostEntity;
}