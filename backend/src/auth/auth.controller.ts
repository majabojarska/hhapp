import {
  Controller,
  Post,
  Body,
  Delete,
  Header,
  UseGuards,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtToken } from './decorators/jwt-token.decorator';
import { AuthUser } from './decorators/auth-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiUseTags('session')
@Controller('session')
export class AuthController {
  public constructor(private readonly authService: AuthService) { }

  @Post()
  async create(@Body() createSessionDTO: CreateSessionDto) {
    const validUser = await this.authService.validateUser(createSessionDTO);
    return await this.authService.login(validUser);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete()
  async delete(@AuthUser() user: User, @JwtToken() token: string) {
    return await this.authService.logout(user, token);
  }
}
