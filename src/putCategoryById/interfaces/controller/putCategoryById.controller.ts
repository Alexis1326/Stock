import {
  Body,
  Controller,
  Inject,
  Logger,
  Param,
  Put,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProcessTimeService } from '../../../share/domain/config/processTime.service';
import { SERVICE_PREFIX } from '../../../share/domain/resources/constants';
import { ApiResponseDto } from '../../../share/domain/dto/apiResponse.dto';
import { ApmInterceptor } from '../../../share/domain/config/apm.interceptor';
import { PutCategoryByIdService } from 'src/putCategoryById/application/putCategoryById.service';
import { UpdateCategoryDto } from 'src/putCategoryById/domain/dto/updateCategory.dto';

@ApiTags('categorías')
@Controller('categorias')
@UseInterceptors(ApmInterceptor)
export class PutCategoryByIdController {
  private readonly logger = new Logger(PutCategoryByIdController.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(
    private readonly service: PutCategoryByIdService,
    private readonly processTimeService: ProcessTimeService,
  ) {}

  @ApiResponse({
    type: ApiResponseDto,
    status: 200,
  })
  @Put(':id')
  async putCategoryById(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const processTime = this.processTimeService.start();
    try {
      const serviceResponse = await this.service.putCategoryById(id, updateCategoryDto);
      res.status(serviceResponse.responseCode).json(serviceResponse);
    } finally {
      this.logger.log(
        `Consumo del servicio ${SERVICE_PREFIX}/PutCategoryById finalizado`,
        {
          totalProcessTime: processTime.end(),
          transactionId: this.transactionId,
        },
      );
    }
  }
}
