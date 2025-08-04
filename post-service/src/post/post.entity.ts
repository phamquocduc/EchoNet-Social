import { Comment } from "src/comment/comment.entity";
import { Media } from "src/media/media.entity";
import { Reaction } from "src/reaction/reaction.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, Index, UpdateDateColumn } from "typeorm";

@Entity()
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    userId: number;

    @Column('text', { nullable: true })
    content: string;

    @OneToMany(() => Media, media => media.post, { cascade: true })
    media: Media[];

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];

    @OneToMany(() => Reaction, reaction => reaction.post)
    reactions: Reaction[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
