import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { ProductCategory } from "./productCategory.entity";
import { ProductPetType } from "./productPetType.entity";
import { BaseEntity } from "./BaseEntity";

@Entity('products')
export class Product extends BaseEntity {
  @Column({ length: 150 })
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column({ length: 255, nullable: true })
  imagen?: string;

  @Column({ length: 100, nullable: true })
  marca?: string;

  @Column({ length: 50, nullable: true })
  presentacion?: string;

  @Column('int', { default: 5 })
  stockMinimo: number;

  @Column({ default: false })
  requiereReceta: boolean;

  @Column({ length: 100, nullable: true, unique: true })
  codigoBarras?: string;

  @ManyToOne(() => ProductCategory, category => category.productos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: ProductCategory;

  @OneToMany(() => ProductPetType, productPetType => productPetType.product)
  tiposMascota?: ProductPetType[];
}
