import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CategoryDto {

    @ApiProperty({ description: 'Nombre de la categoria' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: 'Descripción de la categoria' })
    @IsString()
    @IsOptional()
    descripcion: string;

}