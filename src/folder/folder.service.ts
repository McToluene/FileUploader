import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entity/folder.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async findOrCreateFolder(name: string): Promise<Folder> {
    let folder = await this.folderRepository.findOne({ where: { name } });
    if (!folder) {
      folder = new Folder();
      folder.name = name;
      folder = await this.folderRepository.save(folder);
    }
    return folder;
  }

  async createFolder(name: string): Promise<Folder> {
    const folder = new Folder();
    folder.name = name;
    return await this.folderRepository.save(folder);
  }
}
