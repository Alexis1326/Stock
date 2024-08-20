import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import {
  OK,
  OUTCODRES,
  SERVICE_UNAVAILABLE,
} from '../../share/domain/resources/constants';
import config from '../../share/domain/resources/env.config';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';
import { NewContractResponse } from '../domain/dto/postProductResponse.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from '../../share/domain/dto/productRequest.dto';
import { ProductEntity } from '../../share/domain/entity/producto.entity';

/**
 *  @description Clase servicio responsable recibir el parametro y realizar la logica de negocio.
 *
 *  @author Celula Azure
 *
 */
@Injectable()
export class PostProductService {
  private readonly logger = new Logger(PostProductService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,

    @InjectModel(ProductEntity.name)
    private readonly ProductModel: Model<ProductEntity>
  ) { }

  public async postProduct(
    productDto: ProductDto,
  ): Promise<ApiResponseDto> {
    try {
      this.logger.log('procedimientoActivacion request', {
        request: productDto,
        transactionId: this.transactionId,
      });
      
      // Buscar si el producto ya existe por nombre
      const existingProduct = await this.ProductModel.findOne({
        nombre: productDto.nombre,
      });

      if (existingProduct) {
        // Si el producto existe se actualiza
        existingProduct.descripcion = productDto.descripcion ?? existingProduct.descripcion;
        existingProduct.precio = productDto.precio;
        existingProduct.descuento = productDto.descuento ?? existingProduct.descuento;

        // Sumar el stock
        existingProduct.stock += productDto.stock;

        // Si el stock actualizado es 0, el estado debe ser 'inactivo'
        if (existingProduct.stock === 0) {
          existingProduct.estado = 'inactivo';
        }

        await existingProduct.save();

        return new ApiResponseDto(HttpStatus.OK, 'successfully updated', []);
      } else {
        // Si el producto no existe, crear uno nuevo
        const createdProduct = new this.ProductModel(productDto);

        // Si el stock es 0, el estado es 'inactivo'
        if (createdProduct.stock === 0) {
          createdProduct.estado = 'inactivo';
        }

        await createdProduct.save();

        return new ApiResponseDto(HttpStatus.OK, 'successfully created', []);
      }
    } catch (error) {""
      this.logger.error(error.message, {
        transactionId: this.transactionId,
        stack: error.stack,
      });
      if (error.response && error.status) {
        throw new HttpException({ response: error.response }, error.status);
      }
      return new ApiResponseDto(
        HttpStatus.SERVICE_UNAVAILABLE,
        SERVICE_UNAVAILABLE,
        new NewContractResponse(OUTCODRES, 0, 0, 0, ''),
      );
    }
  }
}
