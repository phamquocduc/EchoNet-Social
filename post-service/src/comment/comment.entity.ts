import { Post } from "src/post/post.entity";
import { Reaction } from "src/reaction/reaction.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column()
    userId: string;

    @Column({ nullable: true })
    imageUrl: string;

    @ManyToOne(() => Post, post => post.comments)
    post: Post;

    @OneToMany(() => Reaction, reaction => reaction.comment)
    reactions: Reaction[];

    @ManyToOne(() => Comment, comment => comment.children, { nullable: true })
    parent: Comment;

    @OneToMany(() => Comment, comment => comment.parent)
    children: Comment[];

    @CreateDateColumn()
    createdAt: Date;
}
