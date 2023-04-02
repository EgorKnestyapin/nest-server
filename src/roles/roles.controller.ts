import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {

    constructor(private rolesService: RolesService) {}

    /**
     * Создает роль
     * 
     * @param rolesDto Дто роли
     * @returns Объект роли
     */
    @Post()
    create(@Body() rolesDto: CreateRoleDto) {
        return this.rolesService.createRole(rolesDto);
    }

    /**
     * Получает роль по значению
     * 
     * @param value Значение роли
     * @returns Объект роли
     */
    @Get('/:value')
    getByValue(@Param('value') value: string) {
        return this.rolesService.getRoleByValue(value);
    }
}
