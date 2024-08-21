import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../share/domain/resources/env.config';
import { PutCategoryByIdController } from '../controller/putCategoryById.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryEntity, CategorySchema } from 'src/share/domain/entity/category.entity';
import { PutCategoryByIdService } from 'src/putCategoryById/application/putCategoryById.service';

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
  controllers: [PutCategoryByIdController],
  providers: [PutCategoryByIdService],
})
export class PutCategoryByIdModule {}