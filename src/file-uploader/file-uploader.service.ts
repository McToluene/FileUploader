import { Injectable } from '@nestjs/common';
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

  async saveFile(file: Express.Multer.File, folder: Folder): Promise<File> {
    const buffer = Buffer.from(await fs.promises.readFile(file.path));
    const newFile = new File();
    newFile.filename = file.filename;
    newFile.mimetype = file.mimetype;
    newFile.content = buffer;
    newFile.folder = folder;
    return await this.fileRepository.save(newFile);
  }

  async getFileByName(filename: string): Promise<File> {
    return this.fileRepository.findOne({ where: { filename } });
  }

  async getAllFiles(): Promise<FileResponseDto[]> {
    return this.fileRepository.find({ select: ['id', 'filename', 'mimetype'] });
  }
}
