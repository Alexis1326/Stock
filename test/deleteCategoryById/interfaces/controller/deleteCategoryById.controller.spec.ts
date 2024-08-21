import { Test, TestingModule } from '@nestjs/testing';
import { ProcessTimeService } from '../../../../src/share/domain/config/processTime.service';
import { ApiResponseDto } from '../../../../src/share/domain/dto/apiResponse.dto';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { DeleteCategoryByIdController } from '../../../../src/deleteCategoryById/interfaces/controller/deleteCategoryById.controller';
import { DeleteCategoryByIdService } from '../../../../src/deleteCategoryById/application/deleteCategoryById.service';
import { ApmService } from '../../../../src/share/domain/config/apm.service';
import { TransaccionIdProvider } from '../../../../src/share/domain/config/transactionId.provider';

describe('DeleteCategoryByIdController', () => {
  let controller: DeleteCategoryByIdController;
  let service: DeleteCategoryByIdService;
  let app: INestApplication;
  
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [DeleteCategoryByIdController],
      providers: [
        {
          provide: DeleteCategoryByIdService,
          useValue: {
            deleteCategoryById: jest.fn(),
          },
        },
        ProcessTimeService,
        TransaccionIdProvider,
        ApmService,
      ],
    }).compile();

    controller = moduleRef.get<DeleteCategoryByIdController>(DeleteCategoryByIdController);
    service = moduleRef.get<DeleteCategoryByIdService>(DeleteCategoryByIdService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('DELETE /categorias/:id', () => {
    it('should delete a category and return success response', async () => {
      const categoryId = 'some-category-id';
      const mockResponse = new ApiResponseDto(200, 'Category deleted successfully', null);

      jest.spyOn(service, 'deleteCategoryById').mockResolvedValue(mockResponse);

      await request(app.getHttpServer())
        .delete(`/categorias/${categoryId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.responseCode).toBe(200);
          expect(res.body.message).toBe('Category deleted successfully');
          expect(service.deleteCategoryById).toHaveBeenCalledWith(categoryId);
        });
    });

    it('should handle errors from service', async () => {
      const categoryId = 'some-category-id';
      jest.spyOn(service, 'deleteCategoryById').mockRejectedValue(new Error('Error deleting category'));

      await request(app.getHttpServer())
        .delete(`/categorias/${categoryId}`)
        .expect(500)
        .expect((res) => {
          expect(res.body.responseCode).toBe(undefined);
          expect(res.body.message).toBe('Internal server error');
        });
    });
  });
});
