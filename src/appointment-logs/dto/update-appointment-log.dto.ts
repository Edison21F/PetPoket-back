import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentLogDto } from './create-appointment-log.dto';

export class UpdateAppointmentLogDto extends PartialType(CreateAppointmentLogDto) {}
