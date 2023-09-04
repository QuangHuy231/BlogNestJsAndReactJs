import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
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
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
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
  }
}
