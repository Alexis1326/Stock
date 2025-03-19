import { BindParameter, BIND_OUT, STRING,CURSOR }  from 'oracledb';

export class PortacionRequestDto {
  VC_MSISDN: string;
  P_CUR_SADE_SALPAQ: BindParameter;
  P_CUR_SLLAMXCOBRAR: BindParameter;
  P_CUR_OTRAS: BindParameter;
  P_VC_SALIDA: BindParameter;
 
  constructor(iMSISDN : string) {
    this.VC_MSISDN = iMSISDN;
    this.P_CUR_SADE_SALPAQ = { type: CURSOR, dir: BIND_OUT };
    this.P_CUR_SLLAMXCOBRAR = { type: CURSOR, dir: BIND_OUT };
    this.P_CUR_OTRAS = { type: CURSOR, dir: BIND_OUT };
    this.P_VC_SALIDA = { type: STRING, dir: BIND_OUT };
  }
}
