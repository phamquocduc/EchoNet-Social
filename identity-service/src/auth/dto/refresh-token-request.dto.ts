import { IsString } from "class-validator";

export class RefreshTokenRequestDto {
    @IsString()
    token: string;
}