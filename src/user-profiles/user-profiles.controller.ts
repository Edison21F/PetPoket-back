import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('user-profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Post()
  create(@Request() req, @Body() profileData: any) {
    return this.userProfilesService.create(req.user.id, profileData);
  }

  @Get('my-profile')
  getMyProfile(@Request() req) {
    return this.userProfilesService.findByUserId(req.user.id);
  }

  @Get()
  @Roles('ADMIN', 'VETERINARIO')
  findAll() {
    return this.userProfilesService.findAll();
  }

  @Get(':userId')
  @Roles('ADMIN', 'VETERINARIO')
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.userProfilesService.findByUserId(userId);
  }

  @Patch()
  updateMyProfile(@Request() req, @Body() updateData: any) {
    return this.userProfilesService.update(req.user.id, updateData);
  }

  @Patch(':userId')
  @Roles('ADMIN')
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateData: any,
  ) {
    return this.userProfilesService.update(userId, updateData);
  }

  @Delete(':userId')
  @Roles('ADMIN')
  remove(@Param('userId', ParseIntPipe) userId: number) {
    return this.userProfilesService.delete(userId);
  }
}