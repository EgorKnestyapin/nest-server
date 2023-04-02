import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CreateUserProfileDto } from 'src/profiles/dto/create-userProfile.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    /**
     * Производит авторизацию пользователя
     * 
     * @param userDto Дто пользователя
     * @returns Токен авторизованного пользователя
     */
    @Post('/login')
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }

    /**
     * Создает пользователя и профиль
     * 
     * @param userDto Дто пользователя и профиля
     * @returns Токен зарегистрированного пользователя
     */
    @UsePipes(ValidationPipe)
    @Post('/registration')
    registration(@Body() userDto: CreateUserProfileDto) {
        return this.authService.registration(userDto);
    }
}