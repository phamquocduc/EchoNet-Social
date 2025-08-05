import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ForgotPasswordVerify } from './forgot-password-verify.entity';
import { ForgotPasswordService } from './forgot-password-verify.service';
import { ForgotPasswordRepository } from './fotgot-password-verify.repository';

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
        TypeOrmModule.forFeature([ForgotPasswordVerify]),
    ],
    controllers: [],
    providers: [ForgotPasswordService, ForgotPasswordRepository],
    exports: [ForgotPasswordService, ForgotPasswordRepository],
})
export class ForgotPasswordVerifyModule { }
