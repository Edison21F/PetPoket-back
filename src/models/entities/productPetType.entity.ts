import { Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Product } from "./product.entity";
import { PetType } from "./petType.entity";

@Entity('product_pet_types')
export class ProductPetType extends BaseEntity {
  @ManyToOne(() => Product, product => product.tiposMascota)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => PetType, petType => petType.productos)
  @JoinColumn({ name: 'pet_type_id' })
  petType: PetType;
}