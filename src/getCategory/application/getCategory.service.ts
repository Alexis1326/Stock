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
import { Model } from 'mongoose';
import { CategoryEntity } from '../../share/domain/entity/category.entity';

@Injectable()
export class getCategoryService {
  private readonly logger = new Logger(getCategoryService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,

    @InjectModel(CategoryEntity.name)
    private readonly CategoryModel: Model<CategoryEntity>,
  ) {}

  public async getAllCategories(): Promise<ApiResponseDto> {
    try {
      this.logger.log('Solicitud para obtener todas las categorías', {
        transactionId: this.transactionId,
      });

      const categorias = await this.CategoryModel.find();

      return new ApiResponseDto(HttpStatus.OK, 'Categories retrieved successfully', {
        categorias,
      });
    } catch (error) {
      this.logger.error('Error en el método getAllCategories', {
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
          message: 'Error inesperado al recuperar las categorías',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
