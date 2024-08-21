import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../../../src/share/domain/resources/env.config';
import { Model } from 'mongoose';
import { DeleteCategoryByIdService } from '../../../src/deleteCategoryById/application/deleteCategoryById.service';
import { CategoryEntity } from '../../../src/share/domain/entity/category.entity';
import { ApiResponseDto } from '../../../src/share/domain/dto/apiResponse.dto';
import { ProcessTimeService } from '../../../src/share/domain/config/processTime.service';
import { ApmService } from '../../../src/share/domain/config/apm.service';
import { TransaccionIdProvider } from '../../../src/share/domain/config/transactionId.provider';

describe('DeleteCategoryByIdService', () => {
  let service: DeleteCategoryByIdService;
  let categoryModel: Model<CategoryEntity>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCategoryByIdService,
        ProcessTimeService,
        ApmService,
        TransaccionIdProvider,
        {
          provide: getModelToken(CategoryEntity.name),
          useValue: {
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: 'TransactionId',
          useValue: 'test-transaction-id',
        },
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config],
        }),
      ],
    }).compile();

    service = moduleRef.get<DeleteCategoryByIdService>(DeleteCategoryByIdService);
    categoryModel = moduleRef.get<Model<CategoryEntity>>(getModelToken(CategoryEntity.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete a category and return success response', async () => {
    // Mock el comportamiento de findByIdAndDelete
    const categoryId = '60c72b2f9e1d8b3c1d5a9c6e'; // ID de ejemplo válido
    jest.spyOn(categoryModel, 'findByIdAndDelete').mockResolvedValueOnce({ _id: categoryId });

    const response = await service.deleteCategoryById(categoryId);

    expect(response).toEqual(
      new ApiResponseDto(HttpStatus.OK, 'Category deleted successfully', [])
    );
    expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
  });

  it('should throw HttpException when category is not found', async () => {
    // Mock el comportamiento de findByIdAndDelete para retornar null
    const categoryId = '60c72b2f9e1d8b3c1d5a9c6e';
    jest.spyOn(categoryModel, 'findByIdAndDelete').mockResolvedValueOnce(null);

    await expect(service.deleteCategoryById(categoryId)).rejects.toThrow(
      new HttpException('Category not found', HttpStatus.NOT_FOUND)
    );
    expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
  });

  it('should throw HttpException for invalid category ID', async () => {
    await expect(service.deleteCategoryById('')).rejects.toThrow(
      new HttpException('Invalid category ID', HttpStatus.BAD_REQUEST)
    );
  });
});
