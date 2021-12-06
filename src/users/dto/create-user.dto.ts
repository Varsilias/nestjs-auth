/* eslint-disable */
import { IsEmail, IsNotEmpty, IsString, IsAlphanumeric } from 'class-validator'
export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    readonly firstname: string;

    @IsNotEmpty()
    @IsString()
    readonly lastname: string;

    @IsNotEmpty()
    @IsAlphanumeric()
    readonly username: string;


    @IsEmail()
    readonly email: string;


    @IsNotEmpty()
    readonly password: string;


    readonly refreshToken?: string
}
