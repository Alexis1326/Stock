import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { postToSellProducByIdtService } from '../../application/postToSellProductById.service';
import configuration from '../../../share/domain/resources/env.config';
import { PostToSellProductByIdController } from '../controller/postToSellProductById.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductEntity, ProductSchema } from 'src/share/domain/entity/producto.entity';
import { CategoryEntity, CategorySchema } from 'src/share/domain/entity/category.entity';
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
        name: ProductEntity.name,
        schema: ProductSchema,
      },
      {
        name: CategoryEntity.name,
        schema: CategorySchema,
      },
      {
        name: Ventas.name,
        schema: VentasSchema,
      }
    ]),
  ],
  controllers: [PostToSellProductByIdController],
  providers: [postToSellProducByIdtService],
})
export class PostToSellProductByIdModule {}