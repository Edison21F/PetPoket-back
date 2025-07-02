import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Pet } from "./pet.entity";
import { Service } from "./service.entity";
import { AppointmentStatus } from "./appointmentStatus.entity";
import { BaseEntity } from "./BaseEntity";

@Entity('appointments')
export class Appointment extends BaseEntity {
  @ManyToOne(() => User, user => user.citas)
  @JoinColumn({ name: 'cliente_id' })
  cliente: User;

  @ManyToOne(() => Pet, pet => pet.citas)
  @JoinColumn({ name: 'mascota_id' })
  mascota: Pet;

  @ManyToOne(() => Service, service => service.citas)
  @JoinColumn({ name: 'servicio_id' })
  servicio: Service;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column('text', { nullable: true })
  observaciones?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precioFinal?: number;

  @ManyToOne(() => AppointmentStatus, status => status.citas)
  @JoinColumn({ name: 'estado_cita_id' })
  estadoCita: AppointmentStatus;
}