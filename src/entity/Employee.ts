import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Driver } from './Driver';
import { Mechanic } from './Mechanic';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id!: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  first_name!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  last_name!: string;

  @Column({ type: 'int', nullable: false })
  years_of_service!: number;

  @OneToMany(() => Driver, (driver) => driver.employee)
  drivers!: Driver[];

  @OneToMany(() => Mechanic, (mechanic) => mechanic.employee)
  mechanics!: Mechanic[];
}
