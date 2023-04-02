import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDro } from './dto/ban-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService) {}

    /**
     * Создает пользователя
     * 
     * @param dto Дто пользователя
     * @returns Объект пользователя
     */
    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue('USER');
        await user.$set('roles', [role.id]);
        user.roles = [role];
        return user;
    }

    /**
     * Получает всех пользователей
     * 
     * @returns Массив объектов пользователя
     */
    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    /**
     *  Получает пользователя по емэйлу
     * 
     * @param email Емэйл пользователя
     * @returns Объект пользователя
     */
    async getUsersByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user;
    }

    /**
     * Добавляет новую роль
     * 
     * @param dto Дто добавления роли
     * @returns Дто добавленной роли
     */
    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (user && role) {
            await user.$add('role', role.id);
            return dto;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }

    /**
     * Банит пользователя
     * 
     * @param dto Дто бана пользователя
     * @returns Объект забаненного пользователя
     */
    async ban(dto: BanUserDro) {
        const user = await this.userRepository.findByPk(dto.userId);
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND); 
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }
}
