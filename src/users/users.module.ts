import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports:[
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      global:true,
      secret:'jwtsecret',
      signOptions:{expiresIn:'90d'}
    }),
    MulterModule.register({
      storage:diskStorage ({
        destination:'./upload/users',
        filename:(req,file,cb) =>{
          cb(null,`${Date.now()}-${file.originalname}`)
        }
      })
    })
  ],
  controllers: [UsersController],
  providers: [UsersService,AuthService],
  exports:[UsersService]
})
export class UsersModule {}
