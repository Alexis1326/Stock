import {
  Body,
  Controller,
  Delete,
  Inject,
  Logger,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { DeleteCategoryByIdService } from '../../application/deleteCategoryById.service';
import { ProcessTimeService } from '../../../share/domain/config/processTime.service';
import { SERVICE_PREFIX } from '../../../share/domain/resources/constants';
import { ApiResponseDto } from '../../../share/domain/dto/apiResponse.dto';
import { ApmInterceptor } from '../../../share/domain/config/apm.interceptor';

/**
 *  @description Archivo controlador responsable de manejar las solicitudes entrantes que llegan a un endpoint.
 *  En este caso, será posible acceder por medio del método HTTP DELETE para eliminar una categoría por ID.
 *
 *  @author Celula Azure
 *
 */
@ApiTags('categorias')
@Controller('categorias')
@UseInterceptors(ApmInterceptor)
export class DeleteCategoryByIdController {
  private readonly logger = new Logger(DeleteCategoryByIdController.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly service: DeleteCategoryByIdService,
    private readonly processTimeService: ProcessTimeService,
  ) {}

  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Delete(':id')
  async deleteCategoryById(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    try {
      const serviceResponse = await this.service.deleteCategoryById(id);
      res.status(serviceResponse.responseCode).json(serviceResponse);
    } finally {
      this.logger.log(
        `Consumo del servicio ${SERVICE_PREFIX}/categorías finalizado`,
        {
          totalProcessTime: processTime.end(),
          transactionId: this.transactionId,
        },
      );
    }
  }
}
