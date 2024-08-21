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
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductEntity } from '../../share/domain/entity/producto.entity';

/**
 *  @description Clase servicio responsable recibir el parametro y realizar la logica de negocio.
 *
 *  @author Celula Azure
 *
 */
@Injectable()
export class postToSellProducByIdtService {
  private readonly logger = new Logger(postToSellProducByIdtService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,

    @InjectModel(ProductEntity.name)
    private readonly ProductModel: Model<ProductEntity>
  ) { }

  public async postToSellProductById(
    id: string,
    quantity: number
  ): Promise<ApiResponseDto> {
    try {
      this.logger.log('Solicitud para vender producto', {
        request: 'postToSellProductById request', id, quantity,
        transactionId: this.transactionId,
      });

      // Validar que el ID es válido
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
      }

      // Encontrar el producto
      const producto = await this.ProductModel.findById(id).exec();

      if (!producto) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      // Verificar si el stock es suficiente
      if (producto.stock < quantity) {
        throw new HttpException('Insufficient stock', HttpStatus.BAD_REQUEST);
      }

      // Reducir el stock
      producto.stock -= quantity;
      await producto.save();

      if(producto.stock === 0) {
        producto.estado = 'inactivo';
        await producto.save();
      }

      return new ApiResponseDto(HttpStatus.OK, 'Product sold successfully', producto);
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
