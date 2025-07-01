import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProductCategory } from "./productCategory.entity";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Product extends BaseEntity {
  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('float')
  precio: number;

  @Column('int')
  stock: number;

  @Column()
  imagen: string;

  @ManyToOne(() => ProductCategory)
  @JoinColumn()
  categoria: ProductCategory;
}