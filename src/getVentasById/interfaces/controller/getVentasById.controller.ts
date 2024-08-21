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
import { getVentasByIdService } from 'src/getVentasById/application/getVentasById.service';

/**
 *  @description Controlador para manejar la solicitud de obtener el historial de ventas de un producto específico.
 *
 *  @author Celula Azure
 *
 */
@ApiTags('productos')
@Controller('productos')
@UseInterceptors(ApmInterceptor)
export class GetVentasController {
  private readonly logger = new Logger(GetVentasController.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly service: getVentasByIdService,
    private readonly processTimeService: ProcessTimeService,
  ) {}

  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Get(':id/historial-ventas')
  async getVentas(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    try {
      const ventas = await this.service.getVentasById(id);
      const response = new ApiResponseDto(200, 'Historial de ventas encontrado', ventas);
      res.status(response.responseCode).json(response);
    } finally {
      this.logger.log(
        `Consumo del servicio ${SERVICE_PREFIX}/GetSalesHistory finalizado`,
        {
          totalProcessTime: processTime.end(),
          transactionId: this.transactionId,
        },
      );
    }
  }
}
