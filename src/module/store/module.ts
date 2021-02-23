import { Global, Module } from '@nestjs/common';
import { StoreProvider } from './provider';

@Global()
@Module({ exports: [StoreProvider], providers: [StoreProvider] })
export class StoreModule {}
