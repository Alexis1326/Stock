import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Nombre de la categoría', required: false })
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Descripción de la categoría', required: false })
  descripcion?: string;
}
