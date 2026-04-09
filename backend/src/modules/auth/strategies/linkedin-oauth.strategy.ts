import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('linkedin.clientId'),
      clientSecret: configService.get('linkedin.clientSecret'),
      callbackURL: configService.get('linkedin.callbackUrl'),
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const user = {
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
      provider: 'linkedin',
      providerId: profile.id,
    };
    done(null, user);
  }
}
