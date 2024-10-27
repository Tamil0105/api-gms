import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryColumn({ type: 'int', width: 5 })
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('text')
  message: string;

  @Column({ default: false })  // Add the isRead column with a default value of false
  isRead: boolean;

  @BeforeInsert()
  generateId() {
    this.id = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
  }
}
