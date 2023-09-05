import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/User.entity';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([Post, User])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
