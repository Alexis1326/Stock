import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../share/domain/resources/env.config';
import {  GetVentasController } from '../controller/getVentasById.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductEntity, ProductSchema } from 'src/share/domain/entity/producto.entity';
import { CategoryEntity, CategorySchema } from 'src/share/domain/entity/category.entity';
import { getCategoryByIdService } from 'src/getCategoryById/application/getCategoryById.service';
import { getVentasByIdService } from 'src/getVentasById/application/getVentasById.service';
import { Ventas, VentasSchema } from 'src/share/domain/entity/ventas.entity';

/**
 *  @description clase anotada con un decorador @Module(). El decorador @Module() proporciona
 *  metadatos que Nest utiliza para organizar la estructura de la aplicación.
 *
 *  @author Fabrica Digital
 *
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forFeature([
      {
        name: Ventas.name,
        schema: VentasSchema,
      },
    ]),
  ],
  controllers: [GetVentasController],
  providers: [getVentasByIdService],
})
export class GetVentasByIdModule {}