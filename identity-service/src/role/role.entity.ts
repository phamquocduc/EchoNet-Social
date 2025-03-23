import { ERole } from "src/enum/role.enum";
import { User } from "src/user/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roleName: ERole;

    @OneToMany(() => User, users => users.role)
    users: User[];
}