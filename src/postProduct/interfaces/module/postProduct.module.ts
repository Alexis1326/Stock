import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostProductService } from '../../application/postProduct.service';
import configuration from '../../../share/domain/resources/env.config';
import { PostProductController } from '../controller/postProduct.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductEntity, ProductSchema } from 'src/share/domain/entity/producto.entity';

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
    ]),
  ],
  controllers: [PostProductController],
  providers: [PostProductService],
})
export class PostProductModule {}