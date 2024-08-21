/**
 *  @description El objeto de transferencia de datos es un objeto que define cómo se enviarán los
 *  datos a través de la red, adicional se pueden usar decoradores de class validator para la definicion
 *  de datos obligatorios o metodos de swagger.
 *
 *  @author Celula Azure
 *
 */
export class NewContractResponse {
  S_IMSI: string;
  S_CO_ID: number;
  S_RESP: number;
  S_CUSTOMER_ID: number;
  S_RESP_DESC: string;
  constructor(
    S_IMSI: string,
    S_CO_ID: number,
    S_RESP: number,
    S_CUSTOMER_ID: number,
    S_RESP_DESC: string,
  ) {
    this.S_IMSI = S_IMSI;
    this.S_CO_ID = S_CO_ID;
    this.S_RESP = S_RESP;
    this.S_CUSTOMER_ID = S_CUSTOMER_ID;
    this.S_RESP_DESC = S_RESP_DESC;
  }
}
