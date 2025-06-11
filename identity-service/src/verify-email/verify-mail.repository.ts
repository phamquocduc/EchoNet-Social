import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VerifyEmail } from "./verify-email.entity";
import { Repository } from "typeorm";
import { VerifyMailDto } from "./dto/verify-mail.dto";

@Injectable()
export class VerifyEmailRepository {
    constructor(
        @InjectRepository(VerifyEmail) private readonly verifyEmailRepository: Repository<VerifyEmail>,
    ) { }

    async createVerifyEmail(verifyEmailDto: VerifyMailDto): Promise<VerifyEmail> {
        const newVerifyEmail = this.verifyEmailRepository.create(verifyEmailDto);
        return await this.verifyEmailRepository.save(newVerifyEmail);
    }

    async findLastestVerifyEmailByEmail(email: string): Promise<VerifyEmail> {
        const verifyEmail = await this.verifyEmailRepository.findOne({
            where: {
                email: email,
                used: false
            },
            order: {
                createdAt: "DESC"
            }
        })

        if (!verifyEmail) {
            throw new BadRequestException("Invalid email");
        }

        return verifyEmail
    }

    async updateVerifyEmail(verifyEmailId: number): Promise<void> {
        const verifyEmail = await this.verifyEmailRepository.findOne({
            where: {
                id: verifyEmailId,
            }
        })

        if (!verifyEmail) {
            throw new BadRequestException("Verify email id not found")
        }

        await this.verifyEmailRepository.update({ id: verifyEmailId }, { used: true });
    }

}