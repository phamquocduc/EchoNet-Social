import { IsEmail, IsString } from 'class-validator';

export class UserAuthCreateDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}