import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Employee } from './Employee';
import { TruckRepair } from './TruckRepair';

@Entity({ name: 'mechanics' })
export class Mechanic {
  @PrimaryGeneratedColumn()
  mechanic_id!: number;

  @ManyToOne(() => Employee, (employee) => employee.mechanics, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({ type: 'varchar', length: 255, default: 'Unknown' })
  specialized_brand!: string;

  @OneToMany(() => TruckRepair, (truckRepair) => truckRepair.mechanic)
  truckRepairs!: TruckRepair[];
}
