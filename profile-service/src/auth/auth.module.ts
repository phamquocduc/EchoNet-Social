import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ConfigModule.forRoot(
            {
                isGlobal: true,
                envFilePath:
                    process.env.NODE_ENV === 'production'
                        ? '.env.production'
                        : '.env.local',
            }
        ),
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY_JWT,
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES
            }
        }),
        ClientsModule.register([
            {
                name: 'IDENTITY_SERVICE',
                transport: Transport.TCP,
                options: {
                    port: Number(process.env.IDENTITY_TCP_PORT)
                }
            }
        ])
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        AuthService,
        JwtService
    ],
    exports: [AuthService]
})
export class AuthModule { }
