import { Body, Controller, Delete, Get, Param, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Roles } from 'src/auth/roles-auth.decorator';  
import { CreateUserProfileDto } from './dto/create-userProfile.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Profile } from './profiles.model';
import { ProfilesGuard } from 'src/auth/profile-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('profiles')
export class ProfilesController {

    constructor(private profileService: ProfilesService) {}

    /**
     * Получает все профили
     * 
     * @returns Массив объектов пользователей
     */
    @ApiOperation({summary: 'Получить все профили'})
    @ApiResponse({status: 200, type: [Profile]})
    @Get()
    getProfiles() {
        return this.profileService.getAllProfiles();
    }

    /**
     * Получает профиль по идентификатору
     * 
     * @param profileId Идентификатор профиля 
     * @returns Объект профиля
     */
    @ApiOperation({summary: 'Получить профиль по идентификатору'})
    @ApiResponse({status: 200, type: Profile})
    @Get('/:id')
    getProfile(@Param('id') profileId: number) {
        return this.profileService.getProfileById(profileId);
    }

    /**
     * Обновляет информацию о пользователе и его профиле по идентификатору
     * 
     * @param profileId Идентификатор профиля
     * @param profileDto Дто профиля
     * @returns Обновленный объект профиля
     */
    @ApiOperation({summary: 'Обновить информацию о пользователе и его профиль'})
    @ApiResponse({status: 200})
    @UsePipes(ValidationPipe)
    @Roles('ADMIN')
    @UseGuards(ProfilesGuard)
    @Put('/:id')
    updateUserProfile(@Param('id') profileId: number, @Body() profileDto: CreateUserProfileDto) {
       return this.profileService.updateUserProfile(profileId, profileDto); 
    }

    /**
     * Удаляет пользователя и его профиль по идентификатору
     * 
     * @param profileId Идентификатор профиля
     * @returns Оставшиеся профили
     */
    @ApiOperation({summary: 'Удалить пользователя и его профиль'})
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(ProfilesGuard)
    @Delete('/:id')
    deleteUserProfile(@Param('id') profileId: number) {
        return this.profileService.deleteUserProfile(profileId);
    }
}
