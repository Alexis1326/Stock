import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import config from '../../share/domain/resources/env.config';
import { ApiResponseDto } from '../../share/domain/dto/apiResponse.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoryEntity } from '../../share/domain/entity/category.entity'; // Importa el modelo correcto

@Injectable()
export class DeleteCategoryByIdService {
  private readonly logger = new Logger(DeleteCategoryByIdService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,

    @InjectModel(CategoryEntity.name) // Usa el modelo de CategoryEntity
    private readonly CategoryModel: Model<CategoryEntity>
  ) { }

  public async deleteCategoryById(
    id: string
  ): Promise<ApiResponseDto> {
    try {
      this.logger.log('DeleteCategoryById request', {
        id,
        transactionId: this.transactionId,
      });

      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid category ID', HttpStatus.BAD_REQUEST);
      }

      const deletedCategory = await this.CategoryModel.findByIdAndDelete(id).exec();

      if (!deletedCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      return new ApiResponseDto(HttpStatus.OK, 'Category deleted successfully', []);
    } catch (error) {
      this.logger.error('Error in deleteCategoryById', {
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
          message: 'Unexpected error deleting category',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
