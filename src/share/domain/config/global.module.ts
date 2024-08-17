import { APP_INTERCEPTOR } from '@nestjs/core';
import { Global, Module, Scope } from '@nestjs/common';

import { ApmService } from './apm.service';
import { ApmInterceptor } from './apm.interceptor';
import { ProcessTimeService } from './processTime.service';
import { TimeOutInterceptor } from './timeout.interceptors';
import { TransaccionIdProvider } from './transactionId.provider';

/**
 *  @description clase anotada con un decorador @Module(). El decorador @Module() proporciona
 *  metadatos que Nest utiliza para organizar la estructura de la aplicación.
 *
 *  @author Fabrica Digital
 *
 */
@Global()
@Module({
  providers: [
    TransaccionIdProvider,
    ProcessTimeService,
    ApmService,
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.DEFAULT,
      useClass: ApmInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.DEFAULT,
      useClass: TimeOutInterceptor,
    },
  ],
  exports: ['TransactionId', ApmService, ProcessTimeService],
})
export class GlobalModule {}
