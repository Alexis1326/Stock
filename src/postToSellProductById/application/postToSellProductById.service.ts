import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
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
import { Ventas } from 'src/share/domain/entity/ventas.entity';

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
    private readonly ProductModel: Model<ProductEntity>,

    @InjectModel(Ventas.name)
    private saleModel: Model<Ventas>
  ) { }

  public async postToSellProductById(
    productId: string,
    cantidad: number
  ): Promise<ApiResponseDto> {
    try {
      this.logger.log('Solicitud para vender producto', {
        request: 'postToSellProductById request', productId, cantidad,
        transactionId: this.transactionId,
      });

      const producto = await this.ProductModel.findById(productId);
      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }

      if (producto.stock < cantidad) {
        throw new Error('Stock insuficiente');
      }

      producto.stock -= cantidad;

      const precioFinal = producto.precio - (producto.precio * producto.descuento / 100);

      await producto.save();

      const nuevaVenta = new this.saleModel({
        productoId: producto._id,
        cantidad,
        precioUnitario: precioFinal,
      });
      await nuevaVenta.save(); 

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
