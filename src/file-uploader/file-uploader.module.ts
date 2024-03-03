import { Module } from '@nestjs/common';
import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entity/file.entity';
import { FolderModule } from 'src/folder/folder.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), FolderModule],
  controllers: [FileUploaderController],
  providers: [FileUploaderService],
})
export class FileUploaderModule {}
