import { BindParameter, BIND_OUT, STRING, NUMBER } from 'oracledb';
import { NewContractRequest } from '../../../domain/dto/newContractRequest.dto';

/**
 *  @description Clase objeto DTO de realizar el mapeo de datos para hacer
 *  el llamado al procedimiento almacenado.
 *
 *  @author Celula Azure
 *
 */
export class PrcRequestDto {
  E_MSISDN: string;
  S_IMSI: BindParameter;
  S_CO_ID: BindParameter;
  S_CUSTOMER_ID: BindParameter;
  S_RESP: BindParameter;
  S_RESP_DESC: BindParameter;

  constructor(req: NewContractRequest) {
    this.E_MSISDN = req.SIMSI;
    this.S_IMSI = { type: STRING, dir: BIND_OUT };
    this.S_CO_ID = { type: NUMBER, dir: BIND_OUT };
    this.S_RESP = { type: NUMBER, dir: BIND_OUT };
    this.S_CUSTOMER_ID = { type: NUMBER, dir: BIND_OUT };
    this.S_RESP_DESC = { type: STRING, dir: BIND_OUT };
  }
}
