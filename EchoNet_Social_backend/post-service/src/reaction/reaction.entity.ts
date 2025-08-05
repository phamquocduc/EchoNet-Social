import { Comment } from "src/comment/comment.entity";
import { ReactionType } from "src/enum/reaction-type.enum";
import { PostEntity } from "src/post/post.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: ReactionType,
  })
  type: ReactionType;

  @ManyToOne(() => PostEntity, post => post.reactions, { nullable: true })
  post: PostEntity;

  @ManyToOne(() => Comment, comment => comment.reactions, { nullable: true })
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
