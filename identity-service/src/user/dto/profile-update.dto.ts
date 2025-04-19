import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { EGender } from "src/enum/gender.enum";

export class ProfileUpdateDto {

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsString()
    @IsOptional()
    coverphoto?: string;

    @IsString()
    @IsOptional()
    fullname?: string;

    @IsDateString()
    @IsOptional()
    dob?: Date;

    @IsEnum(EGender)
    @IsOptional()
    gender?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    currentResidence?: string;

    @IsString()
    @IsOptional()
    hometown?: string;

    @IsString()
    @IsOptional()
    school?: string;

    @IsString()
    @IsOptional()
    workPlace?: string;

    @IsString()
    @IsOptional()
    relationship?: string;
}