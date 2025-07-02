import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ServiceCategory } from "./serviceCategory.entity";
import { ServicePetType } from "./ServicePetType.entity";
import { Appointment } from "./appointment.entity";
import { BaseEntity } from "./BaseEntity";

@Entity('services')
export class Service extends BaseEntity {
  @Column({ length: 150 })
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ length: 255, nullable: true })
  imagen?: string;

  @Column('int', { default: 60 })
  duracionMinutos: number;

  @ManyToOne(() => ServiceCategory, category => category.servicios)
  @JoinColumn({ name: 'categoria_id' })
  categoria: ServiceCategory;

  @OneToMany(() => ServicePetType, servicePetType => servicePetType.service)
  tiposMascota?: ServicePetType[];

  @OneToMany(() => Appointment, appointment => appointment.servicio)
  citas?: Appointment[];
}