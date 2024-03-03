import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileUploaderService } from './file-uploader.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FolderService } from '../folder/folder.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDto } from './dtos/request/file-upload.dto';
import { FileResponseDto } from './dtos/response/file.response.dto';

@Controller('file-uploader')
@ApiTags('files')
export class FileUploaderController {
  constructor(
    private readonly fileService: FileUploaderService,
    private readonly folderService: FolderService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiBody({ description: 'Upload file with folder name', type: FileUploadDto })
  @ApiResponse({
    status: 200,
    description: 'Return the created file details',
    type: FileResponseDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { folderName: string },
  ) {
    const folder = await this.folderService.findOrCreateFolder(body.folderName);
    return this.fileService.saveFile(file, folder);
  }

  @Get()
  @Get()
  @ApiOperation({
    summary: 'Get all files',
    description: 'Returns an array of all files.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return an array of files.',
    type: FileResponseDto,
    isArray: true,
  })
  async getAllFiles(): Promise<FileResponseDto[]> {
    return this.fileService.getAllFiles();
  }

  @Get('download/:filename')
  @ApiParam({
    name: 'filename',
    type: 'string',
    description: 'Name of the file to download',
  })
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const file = await this.fileService.getFileByName(filename);
    if (!file) throw new NotFoundException('File name not found');

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );
    res.send(file.content);
  }
}
