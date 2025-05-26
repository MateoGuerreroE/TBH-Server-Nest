import { Module, DynamicModule } from '@nestjs/common';
import { LoggingService } from './Logging.service';

@Module({})
export class LoggingModule {
  static forContext(context: string): DynamicModule {
    return {
      module: LoggingModule,
      providers: [
        {
          provide: LoggingService,
          useFactory: () => {
            const logger = new LoggingService(context);
            return logger;
          },
        },
      ],
      exports: [LoggingService],
    };
  }
}
