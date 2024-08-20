import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './share/domain/resources/env.config';
import { GlobalModule } from './share/domain/config/global.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostProductModule } from './postProduct/interfaces/module/postProduct.module';
import { GetProductModule } from './getProduct/interfaces/module/getProduct.module';
import { GetProductByIdModule } from './getProductById/interfaces/module/getProductById.module';

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
    GlobalModule,
    MongooseModule.forRoot('mongodb+srv://Alexis:1234@stocks.0xf1g.mongodb.net/Stocks?retryWrites=true&w=majority&appName=Stocks'),
  ],
})
export class AppModule {}