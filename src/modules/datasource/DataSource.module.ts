import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import { UserRepository } from './repositories';
import { DataSourceClient } from './DataSourceClient';

@Module({
  imports: [ConfigModule],
  providers: [UserRepository, DataSourceClient],
  exports: [UserRepository],
})
export class DatasourceModule {}
