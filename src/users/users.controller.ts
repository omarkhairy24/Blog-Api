import { BadRequestException,Request, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UnauthorizedException, MethodNotAllowedException, ForbiddenException, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userDto } from './dto/user.dto';
import { Serialize } from './interceptors/serialize.interceptor';
import { AuthGuard } from './guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUpload } from 'src/fileUpload.service';
import { Request as _Request } from 'express';

@Controller('users')
@Serialize(userDto)
export class UsersController {
    constructor (private userService : UsersService, private authService: AuthService){}

    @UseGuards(AuthGuard)
    @Get('/profile')
    async whoAmI(@Request() req:any ) {
        const user = await this.userService.findOneById(req.user.sub)
        return user
    }

    @Post('/signup')
    async signup(@Body() body:createUserDto){
        if (body.password !== body.confirmPassword){
            throw new UnauthorizedException('password and confirm password must match')
        }

        const user = await this.authService.signup(body.username,body.email,body.password,body.confirmPassword)
        return user
    }

    @Post('/login')
    @HttpCode(200)
    async login(@Body() Body:LoginDto){
        const user = await this.authService.login(Body.email,Body.password)
        return user;
    }

    @UseGuards(AuthGuard)
    @Patch('/:username')
    @UseInterceptors(FileInterceptor('photo'))
    updateUser(@Param('username') username:string,@Request() req:any ,@Body() body:UpdateUserDto,@UploadedFile() file:Express.Multer.File){

        if(req.user.username !== username){
            throw new ForbiddenException()
        }

        if(body.password){
            throw new MethodNotAllowedException('not allowed')
        }
        if(file){
            const photo = file
            body.image = photo.filename;
        }
        return this.userService.update(username,body)
    }

    @UseGuards(AuthGuard)
    @Patch('/:username/updatePassword')
    updatePassword(@Param('username') username:string,@Request() req:any ,@Body() body:UpdateUserDto){
        if(req.user.username !== username){
            throw new ForbiddenException()
        }

        return this.authService.updatePassword(username,body.password)
    }

    @UseGuards(AuthGuard)
    @Delete('/:username')
    deleteUser(@Param('username') username:string ,@Request() req:any){
        
        if(req.user.username !== username){
            throw new ForbiddenException()
        }
        return this.userService.remove(username)
    }
}
