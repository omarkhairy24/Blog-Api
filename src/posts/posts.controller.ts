import { Body, Controller,Request, Post, UseGuards, UploadedFiles, UseInterceptors, Get, Param, Patch, UnauthorizedException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/users/guard/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Serialize } from 'src/users/interceptors/serialize.interceptor';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private postService:PostsService, ){}

    @UseGuards(AuthGuard)
    @Post('addPost')
    @UseInterceptors(FileFieldsInterceptor([
        {name:'cover',maxCount:1},
        {name:'images',maxCount:5}
    ]))
    async addPost(@Body() body:CreatePostDto, @Request() req:any ,@UploadedFiles() files:{cover:Express.Multer.File[] , images:Express.Multer.File[]}){
        
        const cover = files.cover.map(c => c.filename);
        body.cover = cover[0];

        if (files.images) {
            const images = files.images.map(i => i.filename);
            body.images = images;
        }
        return await this.postService.create(req.user.sub , body)
    }

    @Serialize(PostDto)
    @Get('all')
    getAll(@Request() req:any){
        return this.postService.findAll();
    }

    @Serialize(PostDto)
    @Get('/:id')
    getPost(@Param('id') id:number){
        return this.postService.findPost(id)
    }

    @Serialize(PostDto)
    @UseGuards(AuthGuard)
    @Patch('/:id')
    @UseInterceptors(FileFieldsInterceptor([
        {name:'cover',maxCount:1},
        {name:'images',maxCount:5}
    ]))

    async updatePost(@Param('id') id:number , @Body() body:UpdatePostDto, @Request() req:any,@UploadedFiles() files:{cover:Express.Multer.File[] , images:Express.Multer.File[]} ){
        const post = await this.postService.findPost(id)
        if(post.userId.toString() !== req.user.sub ) throw new UnauthorizedException('not allowed');

        if (files.cover){
            const cover = files.cover.map(c => c.filename);
            body.cover = cover[0];
        }
        if(body.oldCover) { body.cover = body.oldCover }
        
        const oldImages = body.oldImages;
        let allImages = [];
        if(Array.isArray(oldImages)){ allImages.push(...oldImages) } else{ allImages.push(oldImages) }

        if(files.images){
            let images = files.images.map(i => i.filename);
            allImages.push(...images)
            body.images = allImages;
        }else body.images = oldImages

        return this.postService.updatePost(id,body);
    }

    async deletePost(@Param('id') id:number, @Request() req:any){
        const post = await this.postService.findPost(id);
        if(post.userId.toString() !== req.user.sub) throw new UnauthorizedException('not allowed');
        await this.postService.deletePost(id)
    }

}