import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { VerifyMailService } from "../verify-mail.service";
import { VerifyMailDto } from "../dto/verify-mail.dto";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";

@Controller()
export class VerifyEmailController {
    constructor(private readonly verifyMailService: VerifyMailService) { }

    @EventPattern('mail.send.verify')
    async handleVerifyMail(@Payload() data: VerifyMailDto) {
        const { email, code } = data;
        await this.verifyMailService.sendVerificationCode(email, code);
    }

    @EventPattern('mail.send.forgot-password')
    async handleForgotPassword(@Payload() data: ForgotPasswordDto) {
        const { email, link } = data;
        await this.verifyMailService.sendLinkForgotPassword(email, link);
    }
}