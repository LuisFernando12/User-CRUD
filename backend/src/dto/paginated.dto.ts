import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginatedDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  limit?: number;
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  page?: number;
}
export class PaginatedResponseDTO<T> extends PaginatedDTO {
  totalPages: number;
  result: T[];
}
