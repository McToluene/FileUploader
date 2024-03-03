import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { File } from './entity/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../folder/entity/folder.entity';
import { FileResponseDto } from './dtos/response/file.response.dto';

@Injectable()
export class FileUploaderService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async saveFile(
    file: Express.Multer.File,
    folder: Folder,
  ): Promise<FileResponseDto> {
    try {
      const buffer = Buffer.from(await fs.promises.readFile(file.path));
      let newFile = new File();
      newFile.filename = file.filename;
      newFile.mimetype = file.mimetype;
      newFile.content = buffer;
      newFile.folder = folder;
      newFile = await this.fileRepository.save(newFile);

      return {
        filename: newFile.filename,
        id: newFile.id,
        mimetype: newFile.mimetype,
      };
    } catch (error) {
      throw new BadRequestException('Unable to save file');
    }
  }

  async getFileByName(filename: string): Promise<File> {
    try {
      const file = await this.fileRepository.findOne({ where: { filename } });
      if (!file) throw new NotFoundException(`${filename} not found`);
      return file;
    } catch (error) {
      throw new BadRequestException('Unable to fetch file');
    }
  }

  async getAllFiles(): Promise<FileResponseDto[]> {
    try {
      return await this.fileRepository.find({
        select: ['id', 'filename', 'mimetype'],
      });
    } catch (error) {
      throw new BadRequestException('Unable to fetch files');
    }
  }
}
