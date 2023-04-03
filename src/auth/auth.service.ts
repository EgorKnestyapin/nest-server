import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { CreateUserProfileDto } from 'src/profiles/dto/create-userProfile.dto';
import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService,
                private jwtService: JwtService,
                private profileService: ProfilesService) {}
    
    /**
     * Производит авторизацию пользователя
     * 
     * @param userDto Дто пользователя
     * @returns Токен авторизованного пользователя
     */
    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user);
    }

    /**
     * Создает пользователя и профиль
     * 
     * @param dto Дто пользователя и профиля
     * @returns Токен зарегистрированного пользователя
     */
    async registration(dto: CreateUserProfileDto) {
        const candidate = await this.usersService.getUsersByEmail(dto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.usersService.createUser({...dto, password: hashPassword});
        await this.profileService.createProfile(dto)
        return this.generateToken(user);
    }

    /**
     * Генерирует токен для пользователя
     * 
     * @param user Объект пользователя
     * @returns Сгенерированный токен
     */
    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles};
        return {
            token: this.jwtService.sign(payload)
        }
    }

    /**
     * Проверяет правильность написания емэйла и пароля
     * 
     * @param userDto Дто пользователя
     * @returns Объект пользователя
     */
    private async validateUser(userDto: CreateUserDto) {
        const user = await this.usersService.getUsersByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный емэйл или пароль'});
    }
}
