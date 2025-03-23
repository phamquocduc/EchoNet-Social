import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UserCreateDto } from "./dto/user-create.dto";
import { ERole } from "src/enum/role.enum";
import { Role } from "src/role/role.entity";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createUser(userCreate: UserCreateDto, roleId: number): Promise<User> {
        const newUser = this.userRepository.create({
            ...userCreate,
            role: {
                id: roleId
            }
        })

        return await this.userRepository.save(newUser)
    }

    async findUserByRoleName(roleName: ERole): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                role:{
                    roleName: roleName
                }
            },
            relations:{
                role: true
            }
        })
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                email: email
            },
            relations:{
                role: true
            }
        })

        if(!user){
            throw new BadRequestException(`User with email ${email} not found`)
        }

        return user
    }
}