import { IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class CreateCarouselDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsNotEmpty()
    @IsString()
    phoneUrl: string;
  }
  export class UpdateCarouselDto {
    @IsOptional()
    @IsString()
    url?: string;

    @IsNotEmpty()
    @IsString()
    phoneUrl: string;
  }