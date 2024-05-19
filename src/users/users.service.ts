import {  Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private repo:typeof User){}

    create(username:string,email:string,password:string){
        return this.repo.create({username,email,password})
    }

    find(email:string){
        return this.repo.findOne({where:{email}})
    }

    findOne(username:string){
        return this.repo.findOne({where:{username}})
    }

    findOneById(id:string){
        return this.repo.findByPk(id)
    }

    async update(username:string,data:Partial<User>){
        const user = await this.repo.findOne({where:{username}})

        if(!user) throw new NotFoundException('user not found');

        user.set(data)

        await user.save();
    }

    async remove(username:string){
        const user = await this.repo.findOne({where:{username}})
        if(!user){
            throw new NotFoundException('user not found')
        }
        
        return user.destroy()
    }
}
