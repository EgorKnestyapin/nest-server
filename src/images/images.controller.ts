import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBlockImageDto } from 'src/blocks/dto/create-blockImage.dto';

@Controller('images')
export class ImagesController {

    constructor(private imageService: ImagesService) {}

    // @Post()
    // @UseInterceptors(FileInterceptor('image'))
    // createImage(@Body() imageDto: CreateBlockImageDto,
    //             @UploadedFile() image) {
    //     return this.imageService.create(imageDto.essenceId, imageDto.essenceTable, image);
    // }

    /**
     * Получает все файлы картинок
     * 
     * @returns Файлы картинок
     */
    @Get()
    getImages() {
        return this.imageService.findAllImages();
    }

    // @Put('/:id')
    // @UseInterceptors(FileInterceptor('image'))
    // updateImage(@Param('id') imageId: number, @UploadedFile() image, @Body() imageDto: CreateImageDto) {
    //     return this.imageService.updateImage(imageId, image, imageDto);
    // }

    /**
     * Удаляет ненужные файлы картинок
     * 
     * @returns Оставшиеся файлы картинок
     */
    @Get('/clear')
    clearImages() {
        return this.imageService.clearImages();
    }
}
