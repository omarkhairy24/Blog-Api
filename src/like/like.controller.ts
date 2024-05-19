import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/guard/auth.guard';
import { LikeService } from './like.service';
import { Request } from '@nestjs/common';

@Controller('like')
export class LikeController {
    constructor(private likeService:LikeService){}

    @UseGuards(AuthGuard)
    @Post('/:id/like')
    async like(@Param('id') id:number ,@Request() req:any){
        const isLiked = await this.likeService.findOne(id , req.user.sub)
        if(isLiked){ 
            return isLiked.destroy()
        }
        return this.likeService.Like(id,req.user.sub)
    }
}
