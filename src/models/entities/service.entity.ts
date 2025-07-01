import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ManyToOne, JoinColumn } from "typeorm";
import { ServiceCategory } from "./serviceCategory.entity";
import { BaseEntity } from "./BaseEntity";

// Service.ts
@Entity()
export class Service extends BaseEntity {
  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('float')
  precio: number;

  @Column()
  imagen: string;

  @ManyToOne(() => ServiceCategory)
  @JoinColumn()
  categoria: ServiceCategory;
}