import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { Folder } from './entity/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder])],
  providers: [FolderService],
  exports: [FolderService],
  controllers: [FolderController],
})
export class FolderModule {}
