import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { VerifyMailService } from "./verify-mail.service";
import { VerifyMailDto } from "./dto/verify-mail.dto";

@Controller()
export class VerifyEmailController {
    constructor(private readonly verifyMailService: VerifyMailService) { }

    @EventPattern('mail.send.verify')
    async handleVerifyMail(@Payload() data: VerifyMailDto) {
        const { email, code } = data;
        await this.verifyMailService.sendVerificationCode(email, code);
    }
}