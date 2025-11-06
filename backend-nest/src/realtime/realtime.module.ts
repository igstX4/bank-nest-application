import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [ConfigModule, JwtModule.register({})],
	providers: [RealtimeGateway],
	exports: [RealtimeGateway],
})
export class RealtimeModule {}
