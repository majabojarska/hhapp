import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';
import { JwtBlacklistEntry } from './jwt-blacklist-entry.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @InjectRepository(JwtBlacklistEntry)
    private readonly jwtBlacklistEntryRepository: Repository<JwtBlacklistEntry>,
  ) { }

  async validateUser(
    createSessionDto: CreateSessionDto,
  ): Promise<User | undefined> {
    const user = await this.userService.findForAuth(createSessionDto.username);
    const valid = await bcryptjs.compare(
      createSessionDto.password,
      user.password,
    );
    if (valid) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      isAdmin: user.isAdmin,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(user: User, token: string) {
    const entry = this.jwtBlacklistEntryRepository.create({
      user,
      token,
    });
    this.jwtBlacklistEntryRepository.save(entry);
  }
}
