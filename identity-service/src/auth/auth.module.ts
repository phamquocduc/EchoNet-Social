import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthExternalController } from './external-controller/auth-external.controller';
import { GoogleStrategy } from './google/google.strategy';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VerifyEmailModule } from 'src/verify-email/verify-email.module';

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
        forwardRef(() => RefreshTokenModule),
        VerifyEmailModule,
        UserModule,
        RoleModule,
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY_JWT,
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES
            }
        }),
        ClientsModule.register([
            {
                name: 'MAIL_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'mail_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
    ],
    controllers: [AuthController, AuthExternalController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        AuthService,
        GoogleStrategy
    ],
    exports: [AuthService]
})
export class AuthModule { }
