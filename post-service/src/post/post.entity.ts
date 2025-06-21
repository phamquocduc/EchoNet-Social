import { Comment } from "src/comment/comment.entity";
import { Reaction } from "src/reaction/reaction.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column('text')
    content: string;

    @Column('json', { nullable: true })
    imageUrls: string[];

    @Column({ nullable: true })
    videoUrl: string;

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];

    @OneToMany(() => Reaction, reaction => reaction.post)
    reactions: Reaction[];


    @CreateDateColumn()
    createdAt: Date;
}
