import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductoDto {
    
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Nombre del producto', required: false })
    nombre?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Descripción del producto', required: false })
    descripcion?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'Precio del producto', required: false })
    precio?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'Stock disponible del producto', required: false })
    stock?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'Descuento del producto', required: false })
    descuento?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Categoria del producto', required: false })
    categoria?: string

}
