import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Folder } from '../../folder/entity/folder.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column({ type: 'bytea', nullable: false })
  content: Buffer;

  @ManyToOne(() => Folder, (folder) => folder.files)
  folder: Folder;
}
