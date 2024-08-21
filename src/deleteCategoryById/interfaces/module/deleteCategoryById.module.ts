import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeleteCategoryByIdService } from '../../application/deleteCategoryById.service';
import configuration from '../../../share/domain/resources/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductEntity, ProductSchema } from 'src/share/domain/entity/producto.entity';
import { CategoryEntity, CategorySchema } from 'src/share/domain/entity/category.entity';
import { DeleteCategoryByIdController } from '../controller/deleteCategoryById.controller';

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
  controllers: [DeleteCategoryByIdController],
  providers: [DeleteCategoryByIdService],
})
export class DeleteCategoryByIdModule {}