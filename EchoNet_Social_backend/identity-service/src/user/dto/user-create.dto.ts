import { IsEmail, IsString, MinLength } from "class-validator";

export class UserCreateDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @MinLength(8)
    confirmPassword: string;

    @IsString()
    fullname: string;
}