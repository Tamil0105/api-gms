import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity('portfolio')
export class Portfolio {
  @PrimaryColumn({ type: 'int', width: 5 })
  id: number;

  @Column({ length: 100 })
  url: string;
  @BeforeInsert()
  generateId() {
    this.id = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
  }
}
