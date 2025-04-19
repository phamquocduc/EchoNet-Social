import { User } from "src/user/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({ default: false })
    revoked: boolean;

    @Column()
    expiresAt: Date;

    @Column()
    createdAt: Date;

    @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
    user: User;

    @Column({ nullable: true })
    deviceInfo: string;

    @Column({ nullable: true })
    browser: string;

    @Column({ nullable: true })
    os: string;
}
