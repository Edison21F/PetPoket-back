import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class ServiceCategory extends BaseEntity {
  @Column({ unique: true })
  nombre: string;
}

