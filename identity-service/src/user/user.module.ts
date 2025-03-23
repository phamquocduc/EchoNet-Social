import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RoleModule } from 'src/role/role.module';
import { UserAdminServices } from './admin/admin.service';

@Module({
  imports: [
    RoleModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [],
  providers: [UserService, UserRepository, UserAdminServices],
  exports: [UserService, UserRepository]
})
export class UserModule {}
