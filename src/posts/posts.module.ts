import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './posts.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:
  [
    SequelizeModule.forFeature([Post]),
    MulterModule.register({
      storage:diskStorage ({
        destination:'./upload/posts',
        filename:(req,file,cb) =>{
          cb(null,`${Date.now()}-${file.originalname}`)
        }
      })
    }),
    UsersModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
