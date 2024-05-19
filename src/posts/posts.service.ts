import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/users.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { Like } from 'src/like/like.entity';
import { Sequelize } from 'sequelize';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post) private repo: typeof Post){}
    async create(userId:string , body:CreatePostDto){
        const post = await this.repo.create({...body,userId})
        await post.save()
        return post
    }

    async findAll(){

        return await this.repo.findAll({
            include: [User,Like],
        })

    }

    findPost(id:number){
        return this.repo.findByPk(id,{
            include:[User,Like]
        })
    }

    async updatePost(id:number,data:UpdatePostDto){
        const post = await this.repo.findByPk(id,{ include:[User] });

        if(!Post) throw new NotFoundException('post not found');

        post.set(data)
        await post.save()
        return post;
    }

    async deletePost(id:number){
        const post = await this.repo.findByPk(id,{ include:[User] });
        if(!Post) throw new NotFoundException('post not found');

        return post.destroy()
    }
}