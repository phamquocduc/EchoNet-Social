import { Injectable } from "@nestjs/common";
import { ForgotPasswordRepository } from "./fotgot-password-verify.repository";
import { ForgotPasswordVerifyDto } from "./dto/forgot-pass-verify.dto";
import { ForgotPasswordVerify } from "./forgot-password-verify.entity";

@Injectable()
export class ForgotPasswordService {
    constructor(
        private readonly forgotPasswordRepository: ForgotPasswordRepository,
    ) { }

    async createForgotPassword(forgotPasswordDto: ForgotPasswordVerifyDto): Promise<ForgotPasswordVerify> {
        return await this.forgotPasswordRepository.createForgotPasswordEmail(forgotPasswordDto);
    }

    async findLastestForgotPasswordByToken(token: string): Promise<ForgotPasswordVerify> {
        return await this.forgotPasswordRepository.findLastestForgotPasswordByToken(token);
    }

    async updateForgotPassword(forgotPasswordId: number): Promise<void> {
        await this.forgotPasswordRepository.updateForgotPassword(forgotPasswordId);
    }

}