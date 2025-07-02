import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Appointment } from "./appointment.entity";

@Entity('appointment_statuses')
export class AppointmentStatus extends BaseEntity {
  @Column({ unique: true, length: 50 })
  nombre: string;

  @Column({ length: 20, unique: true })
  codigo: string; // 'PROGRAMADA', 'CONFIRMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA'

  @Column({ length: 200, nullable: true })
  descripcion?: string;

  @OneToMany(() => Appointment, appointment => appointment.estadoCita)
  citas?: Appointment[];
}