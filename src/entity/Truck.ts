import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Company } from './Company';
import { TruckTrip } from './TruckTrip';
import { TruckRepair } from './TruckRepair';

@Entity({ name: 'trucks' })
export class Truck {
  @PrimaryGeneratedColumn()
  truck_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  brand!: string;
  
  @Column({ nullable: false, default: 0 })
  load!: number;

  @Column({ name: 'truck_capacity', type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  truck_capacity!: number;

  @Column({ nullable: false })
  year!: number;

  @Column({ name: 'number_of_repairs', nullable: false, default: 0 })
  number_of_repairs!: number;

  @ManyToOne(() => Company, (company) => company.trucks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @OneToMany(() => TruckTrip, (truckTrip) => truckTrip.truck)
  truckTrips!: TruckTrip[];

  @OneToMany(() => TruckRepair, (repair) => repair.truck)
  repairs!: TruckRepair[];
}

