import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity('carousel')
export class Carousel {
  @PrimaryColumn({ type: 'int', width: 5 })
  id: number;

  @Column({ length: 100 })
  url: string;

  @Column({ length: 100 ,default:"" } )
  phoneUrl: string;
  
 ;
  
  @BeforeInsert()
  generateId() {
    this.id = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
  }
}
