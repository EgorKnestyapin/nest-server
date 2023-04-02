import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateBlockImageDto } from './dto/create-blockImage.dto';

@Controller('blocks')
export class BlocksController {

    constructor(private blockService: BlocksService) {}

    /**
     * Создает блок вместе с картинкой
     * 
     * @param blockDto Дто блока
     * @param image Файл картинки
     * @returns Объект блока
     */
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    createBlock(@Body() blockDto: CreateBlockImageDto,
                @UploadedFile() image) {
        return this.blockService.createBlock(blockDto, image);
    }
    
    /**
     * Получает блоки по фильтру
     * 
     * @param filter Фильтр для колонки group
     * @returns Массив объектов блока
     */
    @Get('/:filter')
    getFilterBlocks(@Param('filter') filter: string) {
        return this.blockService.getBlocks(filter);
    }

    /**
     * Получает все блоки
     * 
     * @returns Массив объектов блока
     */
    @Get()
    getAllBlocks() {
        return this.blockService.getBlocks(null);
    }

    /**
     * Обновляет информацию в блоке по идентификатору
     * 
     * @param blockId Идентификатор блока
     * @param image Файл картинки
     * @param blockDto Дто блока
     * @returns Обновленный объект блока
     */
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Put('/:id')
    @UseInterceptors(FileInterceptor('image'))
    updateBlock(@Param('id') blockId: number, @UploadedFile() image, @Body() blockDto: CreateBlockDto) {
        return this.blockService.updateBlock(blockId, image, blockDto);
    }

    /**
     * Удаляет блок по идентификатору
     * 
     * @param blockId Индентификатор блока
     * @returns Оставшиеся блоки
     */
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete('/:id')
    deleteBlock(@Param('id') blockId: number) {
        return this.blockService.deleteBlock(blockId);
    }
    
}
