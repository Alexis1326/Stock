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
import { NewContractResponse } from '../domain/dto/getProductResponse.dto';
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
export class getProductService {
  private readonly logger = new Logger(getProductService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,

    @InjectModel(ProductEntity.name)
    private readonly ProductModel: Model<ProductEntity>
  ) { }

  public async getProduct(
    page: number = 1,
    limit: number = 10,
    estado?: string,
    categoria?: string,
    nombre?: string,
  ): Promise<ApiResponseDto> {
    try {
      this.logger.log('procedimientoActivacion request', {
        request: { page, limit, estado, categoria, nombre },
        transactionId: this.transactionId,
      });

      const query: any = {};

      if (estado) {
        query.estado = estado;
      }

      if (categoria) {
        query.categoria = categoria;
      }

      if (nombre) {
        query.nombre = { $regex: nombre, $options: 'i' };
      }

      const skip = (page - 1) * limit;

      const productos = await this.ProductModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate('categoria')
        .exec();

      const total = await this.ProductModel.countDocuments(query).exec();

      this.logger.log('Productos con populate:', productos);
      return new ApiResponseDto(HttpStatus.OK, 'Products retrieved successfully', {
        productos,
        total,
      });
    } catch (error) {
      this.logger.error('Error en el método getProduct', {
        transactionId: this.transactionId,
        stack: error.stack,
        message: error.message,
      });

      // Si el error tiene una respuesta HTTP específica, lanzarla
      if (error.response && error.status) {
        throw new HttpException(error.response, error.status);
      }

      // Si es un error desconocido, devolver la excepción con más detalles
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
