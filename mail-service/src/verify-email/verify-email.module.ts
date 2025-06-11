import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { VerifyMailService } from './verify-mail.service';
import { VerifyEmailController } from './external-controller/verify-email.controller';

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
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            },
            defaults: {
                from: '"ECHO_NET SOCIAL" <no-reply@yourapp.com>',
            },
            template: {
                dir: join(process.cwd(), 'src', 'verify-email', 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            }
        })
    ],
    controllers: [VerifyEmailController],
    providers: [VerifyMailService],
    exports: [],
})
export class VerifyEmailModule { }
