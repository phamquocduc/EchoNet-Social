import { Body, Controller, Get, Post } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleCreateDto } from "./dto/role-create.dto";
import { Role } from "./role.entity";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    async getRoles(): Promise<Role[] | null> {
        return await this.roleService.getAllRoles()
    }

    @Post('create')
    async createRole(@Body() roleCreate: RoleCreateDto): Promise<Role>{
        return await this.roleService.createRole(roleCreate)
    }
}