import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService:UsersService,
        private jwtService:JwtService
    ){}
q
    async signup(username:string,email:string,password:string,confirmPassword:string){
        const checkemail = await this.userService.find(email)
        if(checkemail) throw new BadRequestException('this email already in use');
        
        const checkUsername = await this.userService.findOne(username)
        if(checkUsername) throw new BadRequestException('this username already in use');

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password,salt)
        const user  = this.userService.create(username,email,hash)
        return user
    }

    async login (email:string,password:string){
        const user = await this.userService.find(email)
        if(!user) throw new UnauthorizedException('email or password not correct');
        
        const correctPassword = await bcrypt.compare(password,user.password);

        if(!correctPassword) throw new UnauthorizedException('email or password not correct');
        
        const payload = {sub:user.id,username:user.username}
        
        let access_token = await this.jwtService.signAsync(payload)
        
        return [access_token , user]
    }

    async updatePassword(username:string,password:string){
        const user = await this.userService.findOne(username);
        if(!user) throw new NotFoundException('user not found');

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password,salt)
        user.password = hash;
        await user.save();
        return user;
    }
}