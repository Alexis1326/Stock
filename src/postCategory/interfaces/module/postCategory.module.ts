import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostCategoryService } from '../../application/postCategory.service';
import configuration from '../../../share/domain/resources/env.config';
import { PostCategoryController } from '../controller/postCategory.controller';
import { MongooseModule } from '@nestjs/mongoose';
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
        name: CategoryEntity.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [PostCategoryController],
  providers: [PostCategoryService],
})
export class PostCategoryModule {}