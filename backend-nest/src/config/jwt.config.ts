import { ConfigService } from '@nestjs/config';

export const jwtConfigFactory = (config: ConfigService) => {
  const secret = config.get<string>('JWT_SECRET') || 'dev-secret';
 
  const expiresSeconds = Number(config.get<string>('JWT_EXPIRES_SECONDS') || 60 * 60 * 24 * 7);  //  7 days
  return {
    secret,
    signOptions: { expiresIn: expiresSeconds },
  };
};


