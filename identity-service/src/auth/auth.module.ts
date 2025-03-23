import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        UserModule,
        RoleModule,
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY_JWT,
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
