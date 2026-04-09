import {
  Controller, Post, Body, UseGuards, Request, Get, Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../../common/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  refresh(@Body('refreshToken') token: string, @Request() req) {
    const payload = req.user;
    return this.authService.refresh(payload?.sub);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req, @Res() res) {
    const tokens = await this.authService.oauthLogin(req.user);
    const frontendUrl = this.configService.get('frontend.url');
    res.redirect(
      `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`,
    );
  }

  @Public()
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  linkedinAuth() {}

  @Public()
  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinCallback(@Request() req, @Res() res) {
    const tokens = await this.authService.oauthLogin(req.user);
    const frontendUrl = this.configService.get('frontend.url');
    res.redirect(
      `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`,
    );
  }
}
