import { Controller } from '@nestjs/common';
import { FolderService } from './folder.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('folder')
@ApiTags('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}
}
