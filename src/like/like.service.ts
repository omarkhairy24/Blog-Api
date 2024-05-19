import { Injectable } from '@nestjs/common';
import { Like } from './like.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class LikeService {
    constructor(@InjectModel(Like) private repo:typeof Like){}

    findOne(postId:number ,userId:string){
        return this.repo.findOne({where:{postId,userId}})
    }

    Like(postId:number ,userId:string){
        return this.repo.create({postId ,userId})
    }
}
