import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Employee } from './Employee';
import { TruckTrip } from './TruckTrip';

@Entity({ name: 'drivers' })
export class Driver {
  @PrimaryGeneratedColumn()
  driver_id!: number;

  @ManyToOne(() => Employee, (employee) => employee.drivers, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ type: 'varchar', length: 255, nullable: false })
  driver_category!: string;

  @OneToMany(() => TruckTrip, (truckTrip) => truckTrip.driver1)
  truckTrips1!: TruckTrip[];

  @OneToMany(() => TruckTrip, (truckTrip) => truckTrip.driver2)
  truckTrips2!: TruckTrip[];
}

