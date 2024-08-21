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
import { NewContractResponse } from '../domain/dto/putProductByIdResponse.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductDto } from '../../share/domain/dto/productRequest.dto';
import { ProductEntity } from '../../share/domain/entity/producto.entity';
import { UpdateProductoDto } from '../domain/dto/updateProduct.dto';

/**
 *  @description Clase servicio responsable recibir el parametro y realizar la logica de negocio.
 *
 *  @author Celula Azure
 *
 */
@Injectable()
export class putProducByIdtService {
  private readonly logger = new Logger(putProducByIdtService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,

    @InjectModel(ProductEntity.name)
    private readonly ProductModel: Model<ProductEntity>
  ) { }

  public async putProductById(
    id: string,
    updateProductoDto: UpdateProductoDto,
  ): Promise<ApiResponseDto> {
    try {
      this.logger.log('procedimientoActivacion request', {
        request:  'getProductById request', id ,
        transactionId: this.transactionId,
      });

      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
      }

      const updatedProducto = await this.ProductModel.findByIdAndUpdate(
        id,
        { $set: updateProductoDto },
        { new: true, runValidators: true },
      ).exec();

      if (!updatedProducto) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return new ApiResponseDto(HttpStatus.OK, 'Product updated successfully', updatedProducto);
    } catch (error) {
      this.logger.error('Error en el método getProduct', {
        transactionId: this.transactionId,
        stack: error.stack,
        message: error.message,
      });

      if (error.response && error.status) {
        throw new HttpException(error.response, error.status);
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Error inesperado al recuperar los productos',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
