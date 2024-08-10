import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Shipment } from './Shipment';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  customer_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  customer_address!: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  customer_phone1!: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  customer_phone2!: string;

  @OneToMany(() => Shipment, shipment => shipment.customer, { onDelete: 'CASCADE' })
  shipments!: Shipment[];
}
