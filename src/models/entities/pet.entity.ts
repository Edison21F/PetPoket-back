import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ManyToOne, JoinColumn } from "typeorm";
import { PetType } from "./petType.entity";
import { User } from "./user.entity";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Pet extends BaseEntity {
  @Column()
  nombre: string;

  @Column()
  raza: string;

  @Column()
  edad: number;

  @Column()
  sexo: string;

  @Column()
  color: string;

  @Column('float')
  peso: number;

  @ManyToOne(() => PetType)
  @JoinColumn()
  tipo: PetType;

  @ManyToOne(() => User)
  @JoinColumn()
  propietario: User;
}