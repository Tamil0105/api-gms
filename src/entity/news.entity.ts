import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NewsFeed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column('text')
  details: string;

  @Column({ type: 'enum', enum: ['image', 'video','youtube','instagram'] })
  fileType: 'image' | 'video'|'youtube'|'instagram';

  @Column()
  mediaUrl: string;
}
