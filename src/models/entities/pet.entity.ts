import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { PetType } from "./petType.entity";
import { User } from "./user.entity";
import { Appointment } from "./appointment.entity";
import { BaseEntity } from "./BaseEntity";

@Entity('pets')
export class Pet extends BaseEntity {
  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  raza: string;

  @Column('int')
  edad: number;

  @Column({ length: 20 })
  sexo: string;

  @Column({ length: 50 })
  color: string;

  @Column('decimal', { precision: 5, scale: 2 })
  peso: number;

  @ManyToOne(() => PetType, petType => petType.mascotas)
  @JoinColumn({ name: 'tipo_id' })
  tipo: PetType;

  @ManyToOne(() => User, user => user.mascotas)
  @JoinColumn({ name: 'propietario_id' })
  propietario: User;

  @OneToMany(() => Appointment, appointment => appointment.mascota)
  citas?: Appointment[];
}