import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ValidatedTokenResponseDto } from "./dto/validated-token-response.dto";
import { LoginRequestDto } from "./dto/login-request.dto";
import { UserRepository } from "src/user/user.repository";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtServices: JwtService,
        private readonly userRepository: UserRepository,
    ) {}
  
    async validateToken(token: string): Promise<ValidatedTokenResponseDto> {
        try {
            console.log('Token in identity:', token);
            const payload = await this.jwtServices.verifyAsync(token, {
                secret: process.env.SECRET_KEY_JWT,
            });

            return {
                valid: true,
                code: 200,
                payload: payload,
            };
        } catch (error) {
            return {
                valid: false,
                code: 401,
                payload: null,
            }
        }
    }

    async login(loginRequestDto: LoginRequestDto) {

        const { email, password } = loginRequestDto;

        const user = await this.userRepository.findOneByEmail(email);

        const valid = await bcrypt.compare(password, user.password);

        if(!valid){
            throw new BadRequestException('password is incorrect');
        }

        const payload = { sub: user.id, userEmail: user.email, role: user.role.roleName }

        return{
            access_token: await this.jwtServices.signAsync(payload)
        }
    }
}