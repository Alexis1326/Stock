import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import config from '../../share/domain/resources/env.config';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';
import { Model } from 'mongoose';
import { Ventas } from 'src/share/domain/entity/ventas.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class getVentasByIdService {
  private readonly logger = new Logger(getVentasByIdService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    
    @InjectModel(Ventas.name)
    private readonly ventasModel: Model<Ventas>,
  ) { }

  public async getVentasById(
    id: string
  ): Promise<ApiResponseDto> {
    try {
      this.logger.log('GetCategoryById request', {
        id: id,
        transactionId: this.transactionId,
      });

      const ventas = await this.ventasModel.find({ productoId: id });

      if (!ventas.length) {
        throw new NotFoundException('No se encontró historial de ventas para este producto');
      }

      return new ApiResponseDto(HttpStatus.OK, 'Category traida correctamente', ventas);
    } catch (error) {
      this.logger.error('Error in getCategoryById', {
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
          message: 'Unexpected error retrieving category',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
