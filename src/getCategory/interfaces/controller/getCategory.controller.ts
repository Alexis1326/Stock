import {
  Controller,
  Get,
  Inject,
  Logger,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { getCategoryService } from '../../application/getCategory.service';
import { ProcessTimeService } from '../../../share/domain/config/processTime.service';
import { SERVICE_PREFIX } from '../../../share/domain/resources/constants';
import { ApiResponseDto } from '../../../share/domain/dto/apiResponse.dto';
import { ApmInterceptor } from '../../../share/domain/config/apm.interceptor';

/**
 *  @description Archivo controlador responsable de manejar las solicitudes entrantes que llegan a un end point.
 *  En este caso serán posibles acceder por medio de métodos HTTP.
 *
 *  @author Celula Azure
 *
 */
@ApiTags('categorias')
@Controller('categorias')
@UseInterceptors(ApmInterceptor)
export class GetCategoryController {
  private readonly logger = new Logger(GetCategoryController.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly service: getCategoryService,
    private readonly processTimeService: ProcessTimeService,
  ) {}

  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Get()
  async getCategories(
    @Res() res: Response,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    try {
      const serviceResponse = await this.service.getAllCategories();

      res.status(serviceResponse.responseCode).json(serviceResponse);
    } finally {
      this.logger.log(
        `Consumo del servicio ${SERVICE_PREFIX}/categorias finalizado`,
        {
          totalProcessTime: processTime.end(),
          transactionId: this.transactionId,
        },
      );
    }
  }
}
