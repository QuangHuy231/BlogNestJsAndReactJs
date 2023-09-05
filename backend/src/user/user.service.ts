import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findAll(query: FilterUserDto): Promise<any> {
    const item_per_page = Number(query.item_per_page) || 10;
    const page = Number(query.page) || 1;
    const search = query.search || '';

    const skip = (page - 1) * item_per_page;

    const [users, total] = await this.userRepository.findAndCount({
      where: [
        {
          firstName: Like(`%${search}%`),
        },
        {
          lastName: Like(`%${search}%`),
        },
        {
          email: Like(`%${search}%`),
        },
      ],
      order: {
        createdAt: 'DESC',
      },
      take: item_per_page,
      skip: skip,
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'status',
        'createdAt',
        'updatedAt',
      ],
    });

    const lastPage = Math.ceil(total / item_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: users,
      total,
      currentPage: page,
      nextPage,
      lastPage,
      prevPage,
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'status',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
    return await this.userRepository.update(id, { avatar: avatar });
  }

  async updateAvatarCloudinary(
    id: number,
    file: Express.Multer.File,
  ): Promise<UpdateResult> {
    const avatar = await this.cloudinaryService.uploadFile(file);
    return await this.userRepository.update(id, { avatar: avatar.secure_url });
  }
}
