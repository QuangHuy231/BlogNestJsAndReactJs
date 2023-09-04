import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: registerUserDto.email,
      },
    });
    if (user) {
      throw new HttpException('User already exists', 409);
    }
    const hashPassword = await this.hashPassword(registerUserDto.password);
    return await this.userRepository.save({
      ...registerUserDto,
      refreshToken: 'refreshToken',
      password: hashPassword,
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordMatching = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    //gerenate access token and refresh token
    const payload = { id: user.id, email: user.email };

    return await this.generateToken(payload);
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verifiedToken = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      const checkExists = await this.userRepository.findOne({
        where: {
          email: verifiedToken.email,
          refreshToken: refresh_token,
        },
      });

      if (checkExists) {
        return await this.generateToken({
          id: verifiedToken.id,
          email: verifiedToken.email,
        });
      } else {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST);
    }
  }

  private async generateToken(payload: { id: number; email: string }) {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_LIFE'),
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });

    await this.userRepository.update(
      { email: payload.email },
      { refreshToken: refreshToken },
    );

    return { accessToken, refreshToken };
  }
  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
