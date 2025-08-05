import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RoleModule } from 'src/role/role.module';
import { UserAdminServices } from './admin/admin.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserExternalController } from './external-controller/user-external.controller';

@Module({
  imports: [
    forwardRef(() => RoleModule),
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: 'PROFILE_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 1251
        }
      }
    ]),
  ],
  controllers: [UserExternalController],
  providers: [UserService, UserRepository, UserAdminServices],
  exports: [UserService, UserRepository]
})
export class UserModule { }
