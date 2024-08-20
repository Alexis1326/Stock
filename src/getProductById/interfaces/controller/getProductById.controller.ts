import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { getProducByIdtService } from '../../application/getProductById.service';
import { ProcessTimeService } from '../../../share/domain/config/processTime.service';
import { SERVICE_PREFIX } from '../../../share/domain/resources/constants';
import { ApiResponseDto } from '../../../share/domain/dto/apiResponse.dto';
import { ApmInterceptor } from '../../../share/domain/config/apm.interceptor';
import { ProductDto } from '../../../share/domain/dto/productRequest.dto';

/**
 *  @description Archivo controlador responsable de manejar las solicitudes entrantes que llegan a un end point.
 *  En este caso seran posible acceder por medio de metodos http
 *
 *  @author Celula Azure
 *
 */
@ApiTags('productos')
@Controller('productos')
@UseInterceptors(ApmInterceptor)
export class GetProductByIdController {
  private readonly logger = new Logger(GetProductByIdController.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly service: getProducByIdtService,
    private readonly processTimeService: ProcessTimeService,
  ) {}

  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Get(':id')
  async getProductById(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    try {
      const serviceResponse = await this.service.getProductById(id);
      res.status(serviceResponse.responseCode).json(serviceResponse);
    } finally {
      this.logger.log(
        `Consumo del servicio ${SERVICE_PREFIX}/NewContract finalizado`,
        {
          totalProcessTime: processTime.end(),
          transactionId: this.transactionId,
        },
      );
    }
  }
}