import { Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Service } from "./service.entity";
import { PetType } from "./petType.entity";

@Entity()
export class ServicePetType extends BaseEntity {
  @ManyToOne(() => Service)
  service: Service;

  @ManyToOne(() => PetType)
  petType: PetType;
}
