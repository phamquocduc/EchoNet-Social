import { forwardRef, Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Role])
    ],
    controllers: [RoleController],
    providers: [RoleService, RoleRepository],
    exports: [RoleService, RoleRepository]
})
export class RoleModule { }
