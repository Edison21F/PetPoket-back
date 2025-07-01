import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesGateway } from './roles.gateway';

@Module({
  providers: [RolesGateway, RolesService],
})
export class RolesModule {}
