import { Entity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true, length: 50 })
  nombre: string;

  @Column({ length: 200, nullable: true })
  descripcion?: string;
}