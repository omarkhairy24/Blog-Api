import { Expose, Transform } from "class-transformer";
export class PostDto {

    @Expose()
    id:number

    @Expose()
    cover:string;

    @Expose()
    content:string;

    @Expose()
    highlight:string;

    @Expose()
    images:string[];

    @Expose()
    createdAt:Date

    @Transform(({obj}) => obj.like.length)
    @Expose()
    likes:number

    
    @Expose()
    isLiked:string;

    @Transform(({obj}) => obj.user.username)
    @Expose()
    username:string
}