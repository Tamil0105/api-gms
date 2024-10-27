import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn({ type: 'int', width: 5 })
    id: number;

  @Column()
  username: string;

  @Column()
  password: string;  // Store hashed passwords

  @Column()
  email: string;


  @Column({default:true})
  emailVerified: boolean;
  
  @Column({ nullable: true })
  phone: string;  // Optional contact field
  
  @BeforeInsert()
  generateId() {
    this.id = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
  }
}
