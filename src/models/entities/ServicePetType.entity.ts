import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Service } from "./service.entity";
import { PetType } from "./petType.entity";

@Entity('service_pet_types')
export class ServicePetType extends BaseEntity {
  @ManyToOne(() => Service, service => service.tiposMascota, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => PetType, petType => petType.servicios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_type_id' })
  petType: PetType;

  @Column({ length: 255, nullable: true })
  observaciones?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precioEspecial?: number; // Precio diferente para este tipo de mascota si aplica
}
