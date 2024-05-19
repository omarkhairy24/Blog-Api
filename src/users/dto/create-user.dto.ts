import {IsEmail,IsString} from 'class-validator';

export class createUserDto {
    @IsString()
    username:string;

    @IsEmail()
    email:string

    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;
}