import { Module, forwardRef } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './profiles.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { ProfilesController } from './profiles.controller';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [
    SequelizeModule.forFeature([Profile, User]),
    RolesModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule)
  ],
  exports: [
    ProfilesService
  ]
})
export class ProfilesModule {}
