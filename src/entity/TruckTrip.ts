import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Truck } from './Truck';
import { Driver } from './Driver';
import { Shipment } from './Shipment';

@Entity({ name: 'truck_trips' })
export class TruckTrip {
  @PrimaryGeneratedColumn()
  truck_trip_id!: number;

  @Column({ type: 'varchar', length: 255, default: 'Unknown Route' })
  route!: string;

  @ManyToOne(() => Truck, (truck) => truck.truckTrips, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'truck_id' })
  truck!: Truck;

  @ManyToOne(() => Driver, (driver) => driver.truckTrips1, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'driver1_id' })
  driver1!: Driver;

  @ManyToOne(() => Driver, (driver) => driver.truckTrips2, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'driver2_id' })
  driver2!: Driver;

  @OneToMany(() => Shipment, (shipment) => shipment.truckTrip)
  shipments!: Shipment[];
}
