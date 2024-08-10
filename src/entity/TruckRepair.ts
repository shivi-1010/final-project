import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Truck } from './Truck';
import { Mechanic } from './Mechanic';

@Entity({ name: 'truck_repairs' })
export class TruckRepair {
  @PrimaryGeneratedColumn()
  repair_id!: number;

  @ManyToOne(() => Truck, (truck) => truck.repairs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'truck_id' })
  truck!: Truck;

  @ManyToOne(() => Mechanic, (mechanic) => mechanic.truckRepairs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mechanic_id' })
  mechanic!: Mechanic;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  start_date!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  end_date!: Date;

  @Column()
  estimated_days!: number;
}
