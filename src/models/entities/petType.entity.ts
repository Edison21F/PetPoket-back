import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class PetType extends BaseEntity {
  @Column({ unique: true })
  nombre: string;
}