import { PostEntity } from "src/post/post.entity";
import { Reaction } from "src/reaction/reaction.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    userId: number;

    @Column({ nullable: true })
    imageUrl: string;

    @ManyToOne(() => PostEntity, post => post.comments)
    post: PostEntity;

    @OneToMany(() => Reaction, reaction => reaction.comment)
    reactions: Reaction[];

    @ManyToOne(() => Comment, comment => comment.children, { nullable: true })
    parent: Comment;

    @OneToMany(() => Comment, comment => comment.parent, { nullable: true })
    children: Comment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
