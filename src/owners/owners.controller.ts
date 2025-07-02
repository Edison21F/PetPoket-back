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
  Query,
} from '@nestjs/common';
import { OwnersService } from './owners.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('owners')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Get('dashboard')
  @Roles('CLIENTE')
  getDashboard(@Request() req) {
    return this.ownersService.getOwnerDashboard(req.user.id);
  }

  @Get('my-pets')
  @Roles('CLIENTE')
  getMyPets(@Request() req) {
    return this.ownersService.getOwnerPets(req.user.id);
  }
  @Get('available-products/:petId')
@Roles('CLIENTE')
async getAvailableProducts(@Param('petId', ParseIntPipe) petId: number, @Request() req) {
  return this.ownersService.getAvailableProductsForPet(petId, req.user.id);
}

@Get('products/recommendations')
@Roles('CLIENTE')
async getProductRecommendations(@Request() req) {
  return this.ownersService.getProductRecommendations(req.user.id);
}

  @Get('my-appointments')
  @Roles('CLIENTE')
  getMyAppointments(
    @Request() req,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.ownersService.getOwnerAppointments(req.user.id, { status, startDate, endDate });
  }

  @Get('available-services/:petId')
  @Roles('CLIENTE')
  getAvailableServices(@Param('petId', ParseIntPipe) petId: number, @Request() req) {
    return this.ownersService.getAvailableServicesForPet(petId, req.user.id);
  }

  @Get('appointment-history')
  @Roles('CLIENTE')
  getAppointmentHistory(@Request() req) {
    return this.ownersService.getAppointmentHistory(req.user.id);
  }

  @Get('pet-notes/:petId')
  @Roles('CLIENTE')
  getPetNotes(@Param('petId', ParseIntPipe) petId: number, @Request() req) {
    return this.ownersService.getPetNotes(petId, req.user.id);
  }

  @Get('upcoming-appointments')
  @Roles('CLIENTE')
  getUpcomingAppointments(@Request() req) {
    return this.ownersService.getUpcomingAppointments(req.user.id);
  }
}
