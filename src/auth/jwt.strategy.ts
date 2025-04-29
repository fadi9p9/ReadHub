import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = this.extractToken(req);
    
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    if (this.authService.isTokenRevoked(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return { 
      userId: payload.sub, 
      email: payload.email,
      role: payload.role 
    };
  }

  private extractToken(req: Request): string | undefined {
    // استخراج التوكن من header
    const authHeader = req.headers['authorization'];
    if (authHeader && typeof authHeader === 'string') {
      const [bearer, token] = authHeader.split(' ');
      if (bearer === 'Bearer' && token) {
        return token;
      }
    }

    // استخراج التوكن من query parameter
    if ('query' in req && req.query && typeof req.query === 'object') {
      const queryToken = (req.query as { token?: string }).token;
      if (queryToken) {
        return queryToken;
      }
    }

    return undefined;
  }
}