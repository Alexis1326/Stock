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
import { NewContractResponse } from '../domain/dto/postCategoryResponse.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from '../../share/domain/dto/productRequest.dto';
import { ProductEntity } from '../../share/domain/entity/producto.entity';
import { CategoryEntity } from 'src/share/domain/entity/category.entity';
import { CategoryDto } from 'src/share/domain/dto/categoryRequest.dto';

/**
 *  @description Clase servicio responsable de recibir el parámetro y realizar la lógica de negocio.
 *
 *  @author Celula Azure
 *
 */
@Injectable()
export class PostCategoryService {
  private readonly logger = new Logger(PostCategoryService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,

    @InjectModel(CategoryEntity.name)
    private readonly CategoryModel: Model<CategoryEntity>
  ) { }

  public async postCategory(
    categoryDto: CategoryDto, 
  ): Promise<ApiResponseDto> {
    try {
      this.logger.log('Solicitud para crear o actualizar categoría', {
        request: categoryDto,
        transactionId: this.transactionId,
      });

      const existingCategory = await this.CategoryModel.findOne({
        nombre: categoryDto.nombre,
      }).exec();

      if (existingCategory) {
        throw new HttpException('Category already exists', HttpStatus.BAD_REQUEST);
      } else {
        const createdCategory = new this.CategoryModel({
          nombre: categoryDto.nombre,
          descripcion: categoryDto.descripcion,
        });

        await createdCategory.save();

        return new ApiResponseDto(HttpStatus.CREATED, 'Category successfully created', createdCategory);
      }
    } catch (error) {
      this.logger.error('Error en el método postCategory', {
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
          message: 'Error inesperado al procesar la solicitud',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
