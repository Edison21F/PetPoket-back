import { ManyToOne, Entity, PrimaryGeneratedColumn, Column, JoinColumn } from "typeorm";
import { Role } from "./role.entity";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class User extends BaseEntity {
  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  cedula: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  contrasena: string;

  @ManyToOne(() => Role)
  @JoinColumn()
  rol: Role;
}