import { CPFValidator } from '@/decorator/validator/cpf.validator';
import { IsDateString, IsEmail, IsString } from 'class-validator';
export class CreateUserDTO {
  @IsString()
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @CPFValidator()
  cpf: string;
  @IsDateString()
  birthDate: string;
  @IsString()
  phone: string;
}
