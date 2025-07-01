import { Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Product } from "./product.entity";
import { PetType } from "./petType.entity";

@Entity()
export class ProductPetType extends BaseEntity {
  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => PetType)
  petType: PetType;
}