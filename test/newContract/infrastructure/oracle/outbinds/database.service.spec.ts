import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseOutBindService } from '../../../../../src/newContract/infrastructure/oracle/outbinds/database.service';
import * as oracledb from 'oracledb';
import { OracleService } from '../../../../../src/share/infrastructure/oracle/oracle.service';
import { NewContractRequest } from '../../../../../src/newContract/domain/dto/stockRequest.dto';

jest.mock('../../../../../src/share/infrastructure/oracle/oracle.service');

describe('Database Service', () => {
  let databaseService: DatabaseOutBindService;
  let oracleService: OracleService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        OracleService,
        DatabaseOutBindService,
        {
          provide: 'TransactionId',
          useValue: '98#$vfk/Hd$36G',
        },
      ],
    }).compile();
    databaseService = moduleRef.get<DatabaseOutBindService>(DatabaseOutBindService);
    oracleService = moduleRef.get<OracleService>(OracleService);
  });

  describe('Database Service', () => {
    const payloadNewContract: NewContractRequest = {
      SIMSI: 'string',
      INCALLDUR: 'string',
      INDN_NUM: 'string',
      INESNICCID: 'string',
      INIMEI: 'string',
      INCEDULA: 'string',
      INDEALERID: 'string',
      INSPCODE: 'string',
      INTMCODE: 'string',
      INHLCODE: 'string',
      INCODDIST: 'string',
      INCODDEALERNEG: 'string',
      INANI7DIGIT: 'string',
    };

    it('consumption towards the procedure', async () => {
      expect(databaseService).toBeDefined();
    });

    it('Must response DatabaseService', async () => {
      const oracleConnectionFake = {
        execute: function () {
          return {
            outBinds: {},
          };
        },
        close: function () {
          //
        },
      } as any as oracledb.Connection;

      jest
        .spyOn(oracleService, 'getConnection')
        .mockResolvedValue(oracleConnectionFake);
      const oracleExecuteFake = {
        outBinds: {},
      } as any as oracledb.Result<unknown>;

      jest.spyOn(oracleService, 'execute').mockResolvedValue(oracleExecuteFake);

      await databaseService.prActivacionIvr229(payloadNewContract);
      expect(oracleService.execute).toBeCalled();
    });

    it('Must response DatabaseService', async () => {
      jest
        .spyOn(oracleService, 'getConnection')
        .mockRejectedValue('GetConnection Error');

      expect(
        databaseService.prActivacionIvr229(payloadNewContract),
      ).rejects.toThrowError();
    });
  });
});
