import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PostProductService } from '../../application/postProduct.service';
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
export class PostProductController {
  private readonly logger = new Logger(PostProductController.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly service: PostProductService,
    private readonly processTimeService: ProcessTimeService,
  ) {}

  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Post()
  async postProduct(
    @Res() res: Response,
    @Body() payload: ProductDto,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    try {
      this.logger.log('Controller request message', {
        request: payload,
        transactionId: this.transactionId,
      });
      const serviceResponse = await this.service.postProduct(
        payload,
      );
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