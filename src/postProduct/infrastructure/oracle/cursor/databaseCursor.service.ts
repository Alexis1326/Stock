import { Inject, Injectable, Logger } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { NewContractRequest } from '../../../domain/dto/newContractRequest.dto';

import { OracleService } from '../../../../share/infrastructure/oracle/oracle.service';
import { PortacionRequestDto } from './database.dto';

import { ResponseCursorGenericDto } from '../../../../share/domain/dto/responseCursorGeneric.dto'

/**
 *  @description Metodo que permite realizar la ejecucion del procedimiento almacenado.
 *
 *  @author Celula Azure
 *
 */
@Injectable()
export class DatabaseCursorService {
  private readonly logger = new Logger(DatabaseCursorService.name);
  @Inject('TransactionId') private readonly transactionId: string;

  constructor(private oracleService: OracleService) {}

  public async prConsultarPerfilOrquest(
    newContractRequest: NewContractRequest,
  ){
    let connection: oracledb.Connection;
    let procedureName = process.env.NAME_PROCEDURE_CONSULTAR_PERFIL_ORQUEST
    try {
      connection = await this.oracleService.getConnection();
      return  await this.oracleService.execute<
        PortacionRequestDto,
        ResponseCursorGenericDto
      >(
        connection,
        procedureName,
        new PortacionRequestDto(newContractRequest.SIMSI),
        true
      );
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
