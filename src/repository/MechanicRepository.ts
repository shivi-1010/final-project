import { Repository, EntityTarget, EntityManager } from 'typeorm';
import { Mechanic } from '../entity/Mechanic';

export class MechanicRepository {
    private mechanicRepo: Repository<Mechanic>;

    constructor(entity: EntityTarget<Mechanic>, manager: EntityManager) {
        this.mechanicRepo = manager.getRepository(entity);
    }

    async createMechanic(mechanic: Mechanic): Promise<Mechanic> {
        try {
            return await this.mechanicRepo.save(mechanic);
        } catch (error) {
            throw new Error('Error creating mechanic');
        }
    }

    async readMechanic(mechanic_id: number): Promise<Mechanic | null> {
        try {
            return await this.mechanicRepo.findOne({
                where: { mechanic_id },
                relations: ['employee', 'truckRepairs'],
            });
        } catch (error) {
            throw new Error('Error reading mechanic');
        }
    }

    async updateMechanic(mechanic_id: number, updateData: Partial<Mechanic>): Promise<Mechanic | null> {
        try {
            const result = await this.mechanicRepo.update(mechanic_id, updateData);
            if (result.affected === 0) return null;

            const updatedMechanic = await this.mechanicRepo.findOne({
                where: { mechanic_id },
                relations: ['employee', 'truckRepairs'],
            });
            return updatedMechanic;
        } catch (error) {
            throw new Error('Error updating mechanic');
        }
    }

    async deleteMechanic(mechanic_id: number): Promise<boolean> {
        try {
            const result = await this.mechanicRepo.delete(mechanic_id);
            return result.affected !== 0;
        } catch (error) {
            throw new Error('Error deleting mechanic');
        }
    }

    async readAllMechanics(): Promise<Mechanic[]> {
        try {
            return await this.mechanicRepo.find({ relations: ['employee', 'truckRepairs'] });
        } catch (error) {
            throw new Error('Error reading all mechanics');
        }
    }
}
