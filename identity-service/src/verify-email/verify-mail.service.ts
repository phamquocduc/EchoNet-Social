import { Injectable } from "@nestjs/common";
import { VerifyEmailRepository } from "./verify-mail.repository";
import { VerifyMailDto } from "./dto/verify-mail.dto";
import { VerifyEmail } from "./verify-email.entity";

@Injectable()
export class VerifyMailService {
    constructor(
        private readonly verifyMailRepository: VerifyEmailRepository,
    ) { }

    async createVerifyEmail(verifyMailDto: VerifyMailDto): Promise<VerifyEmail> {
        return await this.verifyMailRepository.createVerifyEmail(verifyMailDto);
    }

    async findVerifyEmailByEmail(email: string): Promise<VerifyEmail> {
        return await this.verifyMailRepository.findVerifyEmailByEmail(email);
    }

    async updateVerifyEmail(verifyEmailId: number): Promise<void> {
        await this.verifyMailRepository.updateVerifyEmail(verifyEmailId);
    }

}