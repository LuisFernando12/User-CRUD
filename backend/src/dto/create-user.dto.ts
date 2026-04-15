import { IsDateString, IsEmail, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  cpf: string;
  @IsDateString()
  birthDate: string;
  @IsString()
  phone: string;
}
