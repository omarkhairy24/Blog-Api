import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Like } from './like.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[SequelizeModule.forFeature([Like]),UsersModule],
  providers: [LikeService],
  controllers: [LikeController]
})
export class LikeModule {}
