import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { BlocksModule } from 'src/blocks/blocks.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ProfilesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => BlocksModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY ?? 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {}
