import { ManyToOne, Entity, Column, JoinColumn, OneToMany } from "typeorm";
import { Role } from "./role.entity";
import { Pet } from "./pet.entity";
import { Appointment } from "./appointment.entity";
import { BaseEntity } from "./BaseEntity";

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  apellidos: string;

  @Column({ unique: true, length: 20 })
  cedula: string;

  @Column({ unique: true, length: 150 })
  correo: string;

  @Column({ length: 255 })
  contrasena: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Role;

  @OneToMany(() => Pet, pet => pet.propietario)
  mascotas?: Pet[];

  @OneToMany(() => Appointment, appointment => appointment.cliente)
  citas?: Appointment[];
}