import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Block } from './blocks.model';
import { CreateBlockDto } from './dto/create-block.dto';
import { FilesService } from 'src/files/files.service';
import { ImagesService } from 'src/images/images.service';
import { CreateBlockImageDto } from './dto/create-blockImage.dto';

@Injectable()
export class BlocksService {

    constructor(@InjectModel(Block) private blockRepository: typeof Block,
                private fileService: FilesService,
                private imageService: ImagesService) {}

    /**
     * Создает блок вместе с картинкой
     * 
     * @param dto Дто блока
     * @param image Файл картинки
     * @returns Объект блока
     */
    async createBlock(dto: CreateBlockImageDto, image: any) {
        const fileName = await this.fileService.createFile(image);
        const block = await this.blockRepository.create({...dto, image: fileName});
        if (image) {
            await this.imageService.create(block.id, "blocks", fileName);
        }
        return block;
    }

    /**
     * Получает блоки по фильтру
     * 
     * @param filter Фильтр для колонки group
     * @returns Массив объектов блока
     */
    async getBlocks(filter: string) {
        if (filter) {
            return await this.blockRepository.findAll({include: {all: true}, where: {group: filter}});
        }
        return await this.blockRepository.findAll({include: {all: true}});
    }

    /**
     * Обновляет информацию в блоке по идентификатору
     * 
     * @param blockId Идентификатор блока
     * @param image Файл картинки
     * @param blockDto Дто блока
     * @returns Обновленный объект блока
     */
    async updateBlock(blockId: number, image: any, blockDto: CreateBlockDto) {
        const block = await this.blockRepository.findOne({where: {id: blockId}});
        if (image && block.image) {
            await this.fileService.deleteFile(block.image);
            const fileName = await this.fileService.createFile(image);
            await this.blockRepository.update({image: fileName, ...blockDto}, {where: {id: blockId}});
            await this.imageService.updateImage(blockId, fileName)
        } else {
            await this.blockRepository.update({...blockDto}, {where: {id: blockId}});
        }
        return await this.blockRepository.findOne({where: {id: blockId}, include: {all: true}});
    }

    /**
     * Удаляет блока по идентификатору
     * 
     * @param blockId Идентификатор блока
     * @returns Оставшиеся блоки
     */
    async deleteBlock(blockId: number) {
        const block = await this.blockRepository.findOne({where: {id: blockId}});
        await this.imageService.deleteImage(blockId)
        await this.blockRepository.destroy({where: {id: blockId}});
        return this.blockRepository.findAll({include: {all: true}});
    }
}
