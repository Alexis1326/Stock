import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { putProducByIdtService } from '../../application/putProductById.service';
import { ProcessTimeService } from '../../../share/domain/config/processTime.service';
import { SERVICE_PREFIX } from '../../../share/domain/resources/constants';
import { ApiResponseDto } from '../../../share/domain/dto/apiResponse.dto';
import { ApmInterceptor } from '../../../share/domain/config/apm.interceptor';
import { UpdateProductoDto } from 'src/putProductById/domain/dto/updateProduct.dto';

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
export class PutProductByIdController {
  private readonly logger = new Logger(PutProductByIdController.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly service: putProducByIdtService,
    private readonly processTimeService: ProcessTimeService,
  ) {}

  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Put(':id')
  async putProductById(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    try {
      const serviceResponse = await this.service.putProductById(id, updateProductoDto);
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