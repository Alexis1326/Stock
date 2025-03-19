import { Inject, Injectable, Logger } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { NewContractRequest } from '../../../domain/dto/newContractRequest.dto';
import { NewContractResponse } from '../../../domain/dto/newContractResponse.dto';
import { OracleService } from '../../../../share/infrastructure/oracle/oracle.service';
import { PrcRequestDto } from './database.dto';
import { plainToClass } from 'class-transformer';

/**
 *  @description Metodo que permite realizar la ejecucion del procedimiento almacenado.
 *
 *  @author Celula Azure
 *
 */
@Injectable()
export class DatabaseOutBindService {
  private readonly logger = new Logger(DatabaseOutBindService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(private oracleService: OracleService) {}

  public async prActivacionIvr229(
    newContractRequest: NewContractRequest,
  ): Promise<NewContractResponse> {
    let connection: oracledb.Connection;
    try {
      connection = await this.oracleService.getConnection();
      const result = await this.oracleService.execute<
        PrcRequestDto,
        NewContractResponse
      >(
        connection,
        process.env.NAME_PROCEDURE,
        new PrcRequestDto(newContractRequest),
        false
      );
      this.logger.log(
        `Ejecucion de procedimiento almacenado exitoso`,
        {
          response: result,
          transactionId: this.transactionId,
        },
      );
      return plainToClass(NewContractResponse, result.outBinds);
    } catch (error) {
      this.logger.error(error.message, {
        transactionId: this.transactionId,
        error: error.stack,
      });
      throw error;
    } finally {
      await connection.close();
    }
  }
}
