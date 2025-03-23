import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { RoleCreateDto } from './dto/role-create.dto';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
    constructor(
        private readonly roleRepository: RoleRepository
    ) {}

    async createRole(roleCreate: RoleCreateDto): Promise<Role> {
        return await this.roleRepository.createRole(roleCreate)
    }

    async getAllRoles(): Promise<Role[] | null> {
        return await this.roleRepository.findAllRoles()
    }
}
