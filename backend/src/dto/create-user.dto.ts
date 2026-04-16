import { IsDateString, IsEmail, IsString } from 'class-validator';
export class CreateUserDTO {
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
