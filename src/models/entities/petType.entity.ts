import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Pet } from "./pet.entity";
import { ServicePetType } from "./ServicePetType.entity";
import { ProductPetType } from "./productPetType.entity";

@Entity('pet_types')
export class PetType extends BaseEntity {
  @Column({ unique: true, length: 50 })
  nombre: string;

  @Column({ length: 200, nullable: true })
  descripcion?: string;

  @OneToMany(() => Pet, pet => pet.tipo)
  mascotas?: Pet[];

  @OneToMany(() => ServicePetType, servicePetType => servicePetType.petType)
  servicios?: ServicePetType[];

  @OneToMany(() => ProductPetType, productPetType => productPetType.petType)
  productos?: ProductPetType[];

  
}