import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(10, 15)  // Phone number length validation
  phone: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
