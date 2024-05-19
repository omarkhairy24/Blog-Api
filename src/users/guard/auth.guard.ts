import { CanActivate,ExecutionContext,Injectable,UnauthorizedException, flatten } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Request } from "express";
import { UsersService } from "../users.service";
import { User } from "../users.entity";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor (
        private jwtService:JwtService,
        private userService:UsersService
    ){}

    async canActivate(context: ExecutionContext):Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token,{
                secret:'jwtsecret'
            });  
                
            request['user'] = payload;

            const user = await this.userService.findOneById(request.user.sub)
            if(this.checkPasswordChanged(user,payload)){
                throw new UnauthorizedException();
            }
            
        } catch (error) {
            throw new UnauthorizedException('invalid token');
        }
        return true;
    }

    private extractTokenFromHeader (req:Request){
        const [type,token] = req.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private checkPasswordChanged(user:User ,payload:any){
        if(user.passwordChangedAt){
            const PCT = user.passwordChangedAt.getTime() / 1000
            return payload.iat < PCT
        }
        return false;
    }
}