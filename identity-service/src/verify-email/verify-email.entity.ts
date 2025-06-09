import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VerifyEmail {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    code: string;

    @Column()
    expiresAt: Date;

    @Column()
    createdAt: Date;

    @Column()
    used: boolean;
}