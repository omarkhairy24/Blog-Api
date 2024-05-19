import { IsString,IsOptional,IsArray } from "class-validator";

export class CreatePostDto {

    @IsString()
    content:string;

    cover:string;

    @IsString()
    highlight:string;

    @IsOptional()
    @IsArray()
    images:string[];
}