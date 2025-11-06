import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CLIENT_URL } from '../config/constants';

@WebSocketGateway({ path: '/ws', transports: ['websocket'] })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	@WebSocketServer()
	server!: Server;

	private userSockets = new Map<number, Set<WebSocket>>();

	constructor(
		private readonly jwt: JwtService,
		private readonly configService: ConfigService,
	) {}

	afterInit(server: Server) {
		// cors
		const clientUrl = this.configService.get<string>('CLIENT_URL') || CLIENT_URL;
		(server as any).options.cors = { origin: [clientUrl] };
	}

	async handleConnection(client: WebSocket, req: any) {
		try {
			const url = new URL(req.url, `http://${req.headers.host}`);
			const token = url.searchParams.get('token');
			if (!token) return client.close(1008, 'No token');
			const secret = this.configService.get<string>('JWT_SECRET') || 'dev-secret';
			const payload = await this.jwt.verifyAsync(token, { secret }) as any;
			const userId = Number(payload.sub);
			if (!userId) return client.close(1008, 'Bad token');
			(client as any).userId = userId;
			if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
			this.userSockets.get(userId)!.add(client);
		} catch {
			client.close(1008, 'Unauthorized');
		}
	}

	handleDisconnect(client: WebSocket) {
		const userId = (client as any).userId as number | undefined;
		if (!userId) return;
		const set = this.userSockets.get(userId);
		if (!set) return;
		set.delete(client);
		if (set.size === 0) this.userSockets.delete(userId);
	}

	notifyUser(userId: number, event: string, data: unknown) {
		const set = this.userSockets.get(userId);
		if (!set) return;
		const message = JSON.stringify({ event, data });
		for (const ws of set) {
			try { ws.send(message); } catch {}
		}
	}
}
