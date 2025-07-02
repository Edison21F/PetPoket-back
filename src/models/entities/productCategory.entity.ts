import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Product } from "./product.entity";

@Entity('product_categories')
export class ProductCategory extends BaseEntity {
  @Column({ unique: true, length: 100 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  descripcion?: string;

  @Column({ length: 255, nullable: true })
  imagen?: string;

  @OneToMany(() => Product, product => product.categoria)
  productos?: Product[];
}