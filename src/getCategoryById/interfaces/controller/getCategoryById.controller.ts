
import {
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProcessTimeService } from '../../../share/domain/config/processTime.service';
import { SERVICE_PREFIX } from '../../../share/domain/resources/constants';
import { ApiResponseDto } from '../../../share/domain/dto/apiResponse.dto';
import { ApmInterceptor } from '../../../share/domain/config/apm.interceptor';
import { getCategoryByIdService } from 'src/getCategoryById/application/getCategoryById.service';

/**
 *  @description Archivo controlador responsable de manejar las solicitudes entrantes que llegan a un endpoint.
 *  En este caso, será posible acceder por medio de métodos HTTP.
 *
 *  @author Celula Azure
 *
 */
@ApiTags('categorias')
@Controller('categorias')
@UseInterceptors(ApmInterceptor)
export class GetCategoryByIdController {
  private readonly logger = new Logger(GetCategoryByIdController.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly service: getCategoryByIdService,
    private readonly processTimeService: ProcessTimeService,
  ) {}

  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Get(':id')
  async getCategoryById(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    try {
      const serviceResponse = await this.service.getCategoryById(id);
      res.status(serviceResponse.responseCode).json(serviceResponse);
    } finally {
      this.logger.log(
        `Consumo del servicio ${SERVICE_PREFIX}/GetCategoryById finalizado`,
        {
          totalProcessTime: processTime.end(),
          transactionId: this.transactionId,
        },
      );
    }
  }
}
