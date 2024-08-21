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
import { NewContractResponse } from '../domain/dto/getProductByIdResponse.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductDto } from '../../share/domain/dto/productRequest.dto';
import { ProductEntity } from '../../share/domain/entity/producto.entity';

@Injectable()
export class getProducByIdtService {
  private readonly logger = new Logger(getProducByIdtService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,

    @InjectModel(ProductEntity.name)
    private readonly ProductModel: Model<ProductEntity>,
  ) {}

  /**
   * @description Método auxiliar para calcular el precio final con descuento
   */
  private calcularPrecioFinal(producto: ProductEntity): number {
    const { precio, descuento } = producto;

    if (descuento && descuento > 0) {
      const precioConDescuento = precio - (precio * descuento) / 100;
      return precioConDescuento;
    }

    return precio;
  }

  public async getProductById(
    id: string
  ): Promise<ApiResponseDto> {
    try {
      this.logger.log('procedimientoActivacion request', {
        request: 'getProductById request', id,
        transactionId: this.transactionId,
      });

      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
      }

      const producto = await this.ProductModel.findById(id).populate('categoria');

      if (!producto) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      const precioFinal = this.calcularPrecioFinal(producto);

      const productoConPrecioFinal = {
        ...producto.toObject(),
        precio: precioFinal,
      };

      return new ApiResponseDto(HttpStatus.OK, 'Product retrieved successfully', productoConPrecioFinal);
    } catch (error) {
      this.logger.error('Error en el método getProductById', {
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
          message: 'Error inesperado al recuperar el producto',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
