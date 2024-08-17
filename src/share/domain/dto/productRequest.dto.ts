import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

/**
 *  @description El objeto de transferencia de datos es un objeto que define cómo se enviarán los
 *  datos a través de la red, adicional se pueden usar decoradores de class validator para la definicion
 *  de datos obligatorios o metodos de swagger.
 *
 *  @author Celula Azure
 *
 */

export class ProductDto {

  @ApiProperty({ description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Descripción del producto' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Precio del producto' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  precio: number;

  @ApiProperty({ description: 'Stock del producto' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ description: 'Categoría del producto' })
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @ApiProperty({ description: 'Descuento del producto' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  descuento?: number;
}