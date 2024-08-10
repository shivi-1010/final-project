import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Truck } from './Truck';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn()
  company_id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  company_name!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  brand!: string;

  @OneToMany(() => Truck, (truck) => truck.company, { cascade: true })
  trucks!: Truck[];
}
