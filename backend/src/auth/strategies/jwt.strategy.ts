import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '../../config/config.service';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { JwtBlacklistEntry } from '../jwt-blacklist-entry.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    @InjectRepository(JwtBlacklistEntry)
    private readonly jwtBlacklistEntryRepository: Repository<JwtBlacklistEntry>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.createJwtOptions().secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any, done: (result: boolean) => void) {
    const token = /.*Bearer *(\S+)$/.exec(req.headers.authorization)[1];
    const blacklisted =
      (await this.jwtBlacklistEntryRepository.count({ token })) !== 0;

    if (blacklisted) {
      done(false);
    } else {
      return {
        id: payload.sub,
        username: payload.username,
        isAdmin: payload.isAdmin,
      };
    }
  }
}
