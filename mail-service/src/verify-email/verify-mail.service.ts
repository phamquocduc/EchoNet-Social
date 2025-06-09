import { Injectable } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class VerifyMailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendVerificationCode(to: string, code: string) {
        await this.mailerService.sendMail({
            to,
            subject: 'Your Verification Code',
            template: 'verify-code',
            context: {
                code,
            },
        });
    }
}