import { IsDateString, IsEmail, IsOptional, IsString, Min } from "class-validator";

export class UserCreateDto {

    @IsEmail()
    email: string;

    @IsString()
    @Min(8)
    password: string;

    @IsString()
    @Min(8)
    confirmPassword: string;

    @IsString()
    fullname: string;
}