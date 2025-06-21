import { Comment } from "src/comment/comment.entity";
import { ReactionType } from "src/enum/reaction-type.enum";
import { Post } from "src/post/post.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: ReactionType,
  })
  type: ReactionType;

  @ManyToOne(() => Post, post => post.reactions, { nullable: true })
  post: Post;

  @ManyToOne(() => Comment, comment => comment.reactions, { nullable: true })
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;
}
