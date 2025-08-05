import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ForgotPasswordVerify } from "./forgot-password-verify.entity";
import { ForgotPasswordVerifyDto } from "./dto/forgot-pass-verify.dto";

@Injectable()
export class ForgotPasswordRepository {
    constructor(
        @InjectRepository(ForgotPasswordVerify) private readonly forgotPasswordRepository: Repository<ForgotPasswordVerify>,
    ) { }

    async createForgotPasswordEmail(forgotPasswordDto: ForgotPasswordVerifyDto): Promise<ForgotPasswordVerify> {
        const newForgotPassword = this.forgotPasswordRepository.create(forgotPasswordDto);
        return await this.forgotPasswordRepository.save(newForgotPassword);
    }

    async findLastestForgotPasswordByToken(token: string): Promise<ForgotPasswordVerify> {
        const forgotPassword = await this.forgotPasswordRepository.findOne({
            where: {
                token: token,
                used: false
            },
            order: {
                createdAt: "DESC"
            }
        })

        if (!forgotPassword) {
            throw new BadRequestException("Invalid token");
        }

        return forgotPassword
    }

    async updateForgotPassword(forgotPasswordId: number): Promise<void> {
        const forgotPassword = await this.forgotPasswordRepository.findOne({
            where: {
                id: forgotPasswordId,
            }
        })

        if (!forgotPassword) {
            throw new BadRequestException("Verify email id not found")
        }

        await this.forgotPasswordRepository.update({ id: forgotPasswordId }, { used: true });
    }

}