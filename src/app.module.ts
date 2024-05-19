import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { LikeModule } from './like/like.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env.${process.env.NODE_ENV}`
    }),
    UsersModule, 
    PostsModule,
    SequelizeModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        return{
          dialect:config.get<string>('DB') as Dialect,
          host: config.get<string>('host'),
          port: config.get<number>('port'),
          username:config.get<string>('username') ,
          password: config.get<string>('password'),
          autoLoadModels:true,
          database:config.get<string>('DB_NAME'),
          synchronize:false
        }
      }
    }),
    LikeModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
