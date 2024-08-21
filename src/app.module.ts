import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import configuration from './share/domain/resources/env.config';
import { GlobalModule } from './share/domain/config/global.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostProductModule } from './postProduct/interfaces/module/postProduct.module';
import { GetProductModule } from './getProduct/interfaces/module/getProduct.module';
import { GetProductByIdModule } from './getProductById/interfaces/module/getProductById.module';
import { PutProductByIdModule } from './putProductById/interfaces/module/putProductById.module';
import { DeleteProductByIdModule } from './deleteProductById/interfaces/module/deleteProductById.module';
import { PostToSellProductByIdModule } from './postToSellProductById/interfaces/module/postToSellProductById.module';
import { PostCategoryModule } from './postCategory/interfaces/module/postCategory.module';
import { GetCategoryModule } from './getCategory/interfaces/module/getCategory.module';
import { GetCategoryByIdModule } from './getCategoryById/interfaces/module/getCategoryById.module';
import { PutCategoryByIdModule } from './putCategoryById/interfaces/module/putCategoryById.module';
import { DeleteCategoryByIdModule } from './deleteCategoryById/interfaces/module/deleteCategoryById.module';
import { GetVentasByIdModule } from './getVentasById/interfaces/module/getCategoryById.module';

/**
 *  @description clase anotada con un decorador @Module(). El decorador @Module() proporciona
 *  metadatos que Nest utiliza para organizar la estructura de la aplicación.
 *
 *  @author Fabrica Digital
 *
 */
@Module({
  providers: [Logger],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PostProductModule,
    GetProductModule,
    GetProductByIdModule,
    PutProductByIdModule,
    DeleteProductByIdModule,
    PostToSellProductByIdModule,
    PostCategoryModule,
    GetCategoryModule,
    GetCategoryByIdModule,
    PutCategoryByIdModule,
    DeleteCategoryByIdModule,
    GetVentasByIdModule,
    GlobalModule,
    MongooseModule.forRoot(`mongodb+srv://Alexis:1234@stocks.0xf1g.mongodb.net/Stocks?retryWrites=true&w=majority&appName=Stocks`),
  ],
})
export class AppModule {}