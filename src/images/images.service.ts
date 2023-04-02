import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import { Image } from './images.model';

@Injectable()
export class ImagesService {

    constructor(@InjectModel(Image) private imageRepository: typeof Image,
                private fileService: FilesService) {}
    
    /**
     * Создает картинку
     * 
     * @param essenceId Идентификатор сущности
     * @param essenceTable Название сущности
     * @param imageName Название картинки
     * @returns Объект картинки
     */
    async create(essenceId: number, essenceTable: string, imageName: string) {
        if (!essenceId) {
            return await this.imageRepository.create({essenceId: null, essenceTable: essenceTable, image: imageName}); 
        }
        return await this.imageRepository.create({essenceId: essenceId, essenceTable: essenceTable, image: imageName}); 
    }

    /**
     * Получает все картинки
     * 
     * @returns Массив объектов картинки
     */
    async findAllImages() {
        return await this.imageRepository.findAll({include: {all: true}});
    }

    /**
     * Обновляет информации о картинке
     * 
     * @param essenceId Идентификатор сущности
     * @param fileName Название картинки
     * @returns Обновленную информацию о картинке
     */
    async updateImage(essenceId: number, fileName: string) {
        await this.imageRepository.update({image: fileName}, {where: {essenceId: essenceId}});
        return await this.imageRepository.findOne({where: {essenceId: essenceId}});
    }

    /**
     * Удаляет информацию о сущности
     * 
     * @param essenceId Идентификатор сущности
     * @returns Обновленную информацию о картинке
     */
    async deleteImage(essenceId: number) {
        await this.imageRepository.update({essenceId: null, essenceTable: null}, {where: {essenceId: essenceId}})
        return this.imageRepository.findOne({where: {essenceId: essenceId}});
    }

    /**
     * Удаляет ненужные картинки спустя время
     * 
     * @returns Оставшиеся картинки
     */
    async clearImages() {
        const images = await this.imageRepository.findAll();
        images.forEach(async image => {
            let nowTime = Date.now();
            let diff = nowTime - image.createdAt;
            const read = await this.fileService.readFile(image.image);
            
            if (!read) {
                await this.imageRepository.destroy({where: {id: image.id}})
            } else if (diff> 3600000 && !image.essenceId && !image.essenceTable) {
                await this.fileService.deleteFile(image.image);
                await this.imageRepository.destroy({where: {id: image.id}})
            }
        });
        return await this.imageRepository.findAll({include: {all: true}});
    }
}
