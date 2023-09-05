import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('thumnail', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExt = ['.png', '.jpg', '.jpeg'];
        if (!allowedExt.includes(ext)) {
          req.fileValidationError =
            'Wrong file extension. Only png, jpg and jpeg are allowed';
          return cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 5 * 1024 * 1024) {
            req.fileValidationError = 'File size is too large. Max size is 5MB';
            return cb(null, false);
          } else {
            return cb(null, true);
          }
        }
      },
    }),
  )
  @UseGuards(AuthGuard)
  create(
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.postService.create(req.user.id, createPostDto, file);
  }
}
