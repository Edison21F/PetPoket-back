import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Service } from "./service.entity";

@Entity('service_categories')
export class ServiceCategory extends BaseEntity {
  @Column({ unique: true, length: 100 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  descripcion?: string;

  @OneToMany(() => Service, service => service.categoria)
  servicios?: Service[];
}