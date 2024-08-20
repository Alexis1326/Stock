import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { putProducByIdtService } from '../../application/putProductById.service';
import configuration from '../../../share/domain/resources/env.config';
import { PutProductByIdController } from '../controller/putProductById.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductEntity, ProductSchema } from 'src/share/domain/entity/producto.entity';
import { CategoryEntity, CategorySchema } from 'src/share/domain/entity/category.entity';

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
    ]),
  ],
  controllers: [PutProductByIdController],
  providers: [putProducByIdtService],
})
export class PutProductByIdModule {}