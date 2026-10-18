import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendMessageDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;

  @IsString()
  @IsNotEmpty()
  turnstileToken: string;

  // Honeypot: campo que visitantes reais não preenchem.
  @IsString()
  @MaxLength(0)
  website: string = '';
}
