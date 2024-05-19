import { IsString,IsOptional} from "class-validator";

export class UpdatePostDto {
    @IsString()
    @IsOptional()
    content:string;

    @IsString()
    @IsOptional()
    cover:string;

    @IsString()
    @IsOptional()
    oldCover:string;


    @IsString()
    @IsOptional()
    highlight:string;

    @IsOptional()
    images:string[];

    @IsOptional()
    oldImages:string[];
}