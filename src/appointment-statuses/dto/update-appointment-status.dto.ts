import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentStatusDto } from './create-appointment-status.dto';

export class UpdateAppointmentStatusDto extends PartialType(CreateAppointmentStatusDto) {}
