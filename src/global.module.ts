import { Global, Module } from '@nestjs/common';
import { Libs } from './libs';

@Global()
@Module({
  imports: [],
  controllers: [],
  exports: [...Libs],
  providers: [...Libs ],
})
export class GlobalModule {}