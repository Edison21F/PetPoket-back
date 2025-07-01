import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Pet } from "./pet.entity";
import { Service } from "./service.entity";
import { AppointmentStatus } from "./appointmentStatus.entity";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Appointment extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn()
  cliente: User;

  @ManyToOne(() => Pet)
  @JoinColumn()
  mascota: Pet;

  @ManyToOne(() => Service)
  @JoinColumn()
  servicio: Service;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @ManyToOne(() => AppointmentStatus)
  @JoinColumn()
  estadoCita: AppointmentStatus;
}
