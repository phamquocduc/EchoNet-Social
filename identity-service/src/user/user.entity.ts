import { Role } from "src/role/role.entity";
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RefreshToken } from "src/refresh-token/refresh-token.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    fullName: string;

    @Column({ nullable: true })
    password: string;

    @ManyToOne(() => Role, role => role.users, { nullable: false })
    role: Role;


    @OneToMany(() => RefreshToken, token => token.user)
    refreshTokens: RefreshToken[];

    @Column({ default: false })
    isVerified: boolean;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}