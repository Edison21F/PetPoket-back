import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN', 'VETERINARIO')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('ADMIN', 'VETERINARIO')
  findAll(@Query('includeInactive') includeInactive?: string) {
    const include = includeInactive === 'true';
    return this.usersService.findAll(include);
  }

  @Get('stats')
  @Roles('ADMIN')
  getUserStats() {
    return this.usersService.getUserStats();
  }

  @Get('by-role/:roleName')
  @Roles('ADMIN', 'VETERINARIO')
  findByRole(@Param('roleName') roleName: string) {
    return this.usersService.findByRole(roleName);
  }

  @Get('profile')
  getOwnProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @Roles('ADMIN', 'VETERINARIO')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch('profile')
  updateOwnProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/restore')
  @Roles('ADMIN')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.restore(id);
  }

  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() body: { currentPassword: string; newPassword: string }
  ) {
    await this.usersService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword
    );
    return { message: 'Contraseña actualizada exitosamente' };
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}