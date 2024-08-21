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
import { CategoryEntity } from '../../share/domain/entity/category.entity';
import { UpdateCategoryDto } from '../domain/dto/updateCategory.dto';

@Injectable()
export class PutCategoryByIdService {
  private readonly logger = new Logger(PutCategoryByIdService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectModel(CategoryEntity.name)
    private readonly CategoryModel: Model<CategoryEntity>,
  ) {}

  public async putCategoryById(
    id: string,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<ApiResponseDto> {
    try {
      this.logger.log('PutCategoryById request', {
        id,
        updateCategoryDto,
        transactionId: this.transactionId,
      });

      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException('Invalid category ID', HttpStatus.BAD_REQUEST);
      }

      // Buscar y actualizar la categoría
      const updatedCategory = await this.CategoryModel.findByIdAndUpdate(
        id,
        { $set: updateCategoryDto },
        { new: true, runValidators: true }
      ).exec();

      if (!updatedCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      return new ApiResponseDto(HttpStatus.OK, 'Category updated successfully', updatedCategory);
    } catch (error) {
      this.logger.error('Error in putCategoryById', {
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
          message: 'Unexpected error updating category',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
