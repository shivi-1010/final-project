import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './Customer';
import { TruckTrip } from './TruckTrip';

@Entity({ name: 'shipments' })
export class Shipment {
  @PrimaryGeneratedColumn()
  shipment_id!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  weight!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  value!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  origin!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  destination!: string;

  @ManyToOne(() => Customer, (customer) => customer.shipments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @ManyToOne(() => TruckTrip, (truckTrip) => truckTrip.shipments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'truck_trip_id' })
  truckTrip!: TruckTrip;
}

