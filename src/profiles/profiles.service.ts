import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profiles.model';
import { CreateUserProfileDto } from './dto/create-userProfile.dto';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfilesService {

    constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
                @InjectModel(User) private userRepository: typeof User,
                private userService: UsersService) {}

    /**
     * Создает профиль
     * 
     * @param dto Дто профиля
     * @returns Объект профиля
     */
    async createProfile(dto: CreateUserProfileDto) {
        try {
            const email = dto.email;
        const user = await this.userRepository.findOne({where: {email}})
        const profile = await this.profileRepository.create({...dto, userId: user.id});
        return profile;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Получает все профили
     * 
     * @returns Массив объектов профиля
     */
    async getAllProfiles() {
        return await this.profileRepository.findAll({include: {all: true}})
    }

    /**
     * Получает профиль по идентификатору
     * 
     * @param profileId Идентификатор профиля
     * @returns Объект профиля
     */
    async getProfileById(profileId: number) {
        return await this.profileRepository.findOne({where: {id: profileId}, include: {all: true}})
    }

    /**
     * Обновляет пользователя и его профиль по идентификатору
     * 
     * @param profileId Идентификатор профиля
     * @param dto Дто профиля и пользователя
     * @returns Обновленный объект профиля
     */
    async updateUserProfile(profileId: number, dto: CreateUserProfileDto) {
        const profile = await this.profileRepository.findOne({where: {id: profileId}});
        await this.profileRepository.update({name: dto.name, surname: dto.surname, phoneNumber: dto.phoneNumber}, 
                                            {where: {id: profileId}});
        const user = await this.userService.getUsersByEmail(dto.email);
        if (!user) {
            if (dto.password) {
                const hashPassword = await bcrypt.hash(dto.password, 5);
                await this.userRepository.update({email: dto.email, password: hashPassword}, {where: {id: profile.userId}});
            } else {
                await this.userRepository.update({...dto}, {where: {id: profile.userId}});
            }
        } else {
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
        }
        return this.profileRepository.findOne({where: {id: profileId}, include: {all: true}});
    }

    /**
     * Удаляет пользователя и его профиль по идентификатору
     * 
     * @param profileId Идентификатор профиля
     * @returns Оставшиеся профили
     */
    async deleteUserProfile(profileId: number) {
        try {
            const profile = await this.profileRepository.findOne({where: {id: profileId}})
            await this.profileRepository.destroy({where: {id: profileId}});
            await this.userRepository.destroy({where: {id: profile.userId}});
            return await this.profileRepository.findAll({include: {all: true}});
        } catch (error) {
            throw new Error(error.message);  
        }
    }
}
