import { Repository, EntityTarget, EntityManager } from 'typeorm';
import { TruckRepair } from '../entity/TruckRepair';

export class TruckRepairRepository {
    private truckRepairRepo: Repository<TruckRepair>;

    constructor(entity: EntityTarget<TruckRepair>, manager: EntityManager) {
        this.truckRepairRepo = manager.getRepository(entity);
    }

    async createTruckRepair(truckRepair: TruckRepair): Promise<TruckRepair> {
        try {
            return await this.truckRepairRepo.save(truckRepair);
        } catch (error) {
            throw new Error('Error creating truck repair');
        }
    }

    async readTruckRepair(repair_id: number): Promise<TruckRepair | null> {
        try {
            return await this.truckRepairRepo.findOne({
                where: { repair_id },
                relations: ['truck', 'mechanic'],
            });
        } catch (error) {
            throw new Error('Error reading truck repair');
        }
    }

    async updateTruckRepair(repair_id: number, updateData: Partial<TruckRepair>): Promise<TruckRepair | null> {
        try {
            const result = await this.truckRepairRepo.update(repair_id, updateData);
            if (result.affected === 0) return null;

            const updatedTruckRepair = await this.truckRepairRepo.findOne({
                where: { repair_id },
                relations: ['truck', 'mechanic'],
            });
            return updatedTruckRepair;
        } catch (error) {
            throw new Error('Error updating truck repair');
        }
    }

    async deleteTruckRepair(repair_id: number): Promise<boolean> {
        try {
            const result = await this.truckRepairRepo.delete(repair_id);
            return result.affected !== 0;
        } catch (error) {
            throw new Error('Error deleting truck repair');
        }
    }

    async readAllTruckRepairs(): Promise<TruckRepair[]> {
        try {
            return await this.truckRepairRepo.find({ relations: ['truck', 'mechanic'] });
        } catch (error) {
            throw new Error('Error reading all truck repairs');
        }
    }
}
