import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  authorName: string;

  @Column('text')
  content: string;

  // Column to store the URL of the uploaded media (image or video)
  @Column('text')
  mediaUrl: string;

  // Column to specify if the file is an image or video
  @Column({ type: 'enum', enum: ['image', 'video','youtube','instagram'] })
  fileType: 'image' | 'video'|'youtube'|'instagram';

  @Column({ type: 'int', default: 5 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;
}
