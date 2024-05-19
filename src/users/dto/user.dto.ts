import { Expose } from "class-transformer";

export class userDto {
    @Expose()
    id:string;
    
    @Expose()
    username:string;

    @Expose()
    email:string;

    @Expose()
    image:string;
}