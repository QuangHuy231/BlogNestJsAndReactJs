import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/User.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(
    id: number,
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<Post> {
    const user = await this.userRepository.findOneBy({
      id: id,
    });
    const fileName = await this.cloudinaryService.uploadFile(file);

    try {
      const res = await this.postRepository.save({
        ...createPostDto,
        thumnail: fileName.secure_url,
        user,
      });
      return await this.postRepository.findOneBy({
        id: res.id,
      });
    } catch (error) {
      throw new HttpException("Can't create post", HttpStatus.BAD_REQUEST);
    }
  }
}
