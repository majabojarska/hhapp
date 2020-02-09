import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from './auth/guards/admin.guard';

@Controller()
@ApiBearerAuth()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @UseGuards(AuthGuard(), AdminGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
