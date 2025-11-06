import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { ConfigService } from '@nestjs/config';
import { CLIENT_URL } from './config/constants';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useWebSocketAdapter(new WsAdapter(app));
	const configService = app.get(ConfigService);
	const clientUrl = configService.get<string>('CLIENT_URL') || CLIENT_URL;
	app.enableCors({
		origin: [clientUrl],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
