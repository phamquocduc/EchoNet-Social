import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyEmail } from './verify-email.entity';
import { ConfigModule } from '@nestjs/config';
import { VerifyMailService } from './verify-mail.service';
import { VerifyEmailRepository } from './verify-mail.repository';

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
        TypeOrmModule.forFeature([VerifyEmail]),
    ],
    controllers: [],
    providers: [VerifyMailService, VerifyEmailRepository],
    exports: [VerifyMailService, VerifyEmailRepository],
})
export class VerifyEmailModule { }
