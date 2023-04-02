import { Module, forwardRef } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { Block } from './blocks.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from 'src/files/files.module';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  controllers: [BlocksController],
  providers: [BlocksService],
  imports: [
    SequelizeModule.forFeature([Block]),
    FilesModule,
    RolesModule,
    ImagesModule,
    forwardRef(() => AuthModule)
  ]
})
export class BlocksModule {}
