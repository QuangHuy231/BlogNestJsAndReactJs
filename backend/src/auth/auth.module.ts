import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
