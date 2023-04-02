import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Image } from './images.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [
    SequelizeModule.forFeature([Image]),
    FilesModule
  ],
  exports: [
    ImagesService
  ]
})
export class ImagesModule {}
