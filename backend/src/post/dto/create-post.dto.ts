import { User } from 'src/user/entities/User.entity';

export class CreatePostDto {
  title: string;
  description: string;

  thumnail: string;
  status: number;
  user: User;
}
