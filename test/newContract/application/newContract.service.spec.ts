import { Test, TestingModule } from '@nestjs/testing';
import { PostProduct } from '../../../src/newContract/application/newContract.service';
import { NewContractController } from '../../../src/newContract/interfaces/controller/newContract.controller';
import { NewContractResponse } from '../../../src/newContract/domain/dto/newContractResponse.dto';
import { DatabaseOutBindService} from '../../../src/newContract/infrastructure/oracle/outbinds/database.service';
import { DatabaseCursorService} from '../../../src/newContract/infrastructure/oracle/cursor/databaseCursor.service';

import { ConfigModule } from '@nestjs/config';
import config from '../../../src/share/domain/resources/env.config';
import { NewContractRequest } from '../../../src/newContract/domain/dto/stockRequest.dto';
import { ProcessTimeService } from '../../../src/share/domain/config/processTime.service';
import { ApmService } from '../../../src/share/domain/config/apm.service';
import { ApiResponseDto } from '../../../src/share/domain/dto/apiResponse.dto';
import { HttpException, HttpStatus } from '@nestjs/common';


jest.mock('../../../src/newContract/infrastructure/oracle/outbinds/database.service');
jest.mock('../../../src/newContract/infrastructure/oracle/cursor/databaseCursor.service');

describe('New Contract Controller', () => {
  let service: PostProduct;
  let databaseService: DatabaseOutBindService;
  let databaseCursorService: DatabaseCursorService;
  

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseOutBindService,
        DatabaseCursorService,
        PostProduct,
        {
          provide: 'TransactionId',
          useValue: '98#$vfk/Hd$36G',
        },
        ProcessTimeService,
        ApmService,
      ],
      controllers: [NewContractController],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config],
        }),
      ],
    }).compile();

    service = moduleRef.get<PostProduct>(PostProduct);
    databaseService = moduleRef.get<DatabaseOutBindService>(DatabaseOutBindService);
    databaseCursorService = moduleRef.get<DatabaseCursorService>(DatabaseCursorService);
    
  });

  describe('New Contract Service', () => {
    it('consumption towards the procedure', async () => {
      expect(service).toBeDefined();
    });

    it('Must response procedimientoActivacion', async () => {
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
      jest
        .spyOn(databaseService, 'prActivacionIvr229')
        .mockResolvedValue(
          new NewContractResponse('OUTCOD_RES', 0, 0, 0, 'OUTDESC_RES'),
        );
      await service.postProduct(payloadNewContract);
      expect(databaseService.prActivacionIvr229).toBeCalled();
    });
    it('Must response procedimientoActivacion catch', async () => {
      jest
        .spyOn(databaseService, 'prActivacionIvr229')
        .mockImplementation(() => {
          throw new Error('There was an error');
        });
      expect(await service.postProduct(null)).toEqual(
        new ApiResponseDto(
          503,
          'Service Unavailable',
          new NewContractResponse('-99', 0, 0, 0, ''),
        )
       );
    });
    it('Must response procedimientoActivacion catch HttpException', async () => {
      jest
        .spyOn(databaseService, 'prActivacionIvr229')
        .mockImplementation(() => {
          throw new HttpException('',HttpStatus.INTERNAL_SERVER_ERROR,{});
        });
      expect(await service.postProduct(null)).toEqual(
        new ApiResponseDto(
          503,
          'Service Unavailable',
          new NewContractResponse('-99', 0, 0, 0, ''),
        )
       );
    });

  });
  describe('validateCursorResponse', () => {
    it('Must response OK', async () => {
      let data = {
        dataCursor : [
          {
            key : 'CURSOR1',
            row :['','','','','','','','']
          },
          {
            key : 'CURSOR2',
            row :['','','','','','','','','','','']
          },
          {
            key : 'CURSOR3',
            row :['','']
          }
        
        ]
      }
      expect(service.validateCursorResponse(data)).toBeDefined();
    });
  });
});
