import { Repository, EntityTarget, EntityManager } from 'typeorm';
import { Truck } from '../entity/Truck';

export class TruckRepository {
    private truckRepo: Repository<Truck>;

    constructor(entity: EntityTarget<Truck>, manager: EntityManager) {
        this.truckRepo = manager.getRepository(entity);
    }

    async createTruck(truck: Truck): Promise<Truck> {
        try {
            return await this.truckRepo.save(truck);
        } catch (error) {
            throw new Error('Error creating truck');
        }
    }

    async readTruck(truck_id: number): Promise<Truck | null> {
        try {
            return await this.truckRepo.findOne({
                where: { truck_id },
                relations: ['company', 'repairs', 'truckTrips'],
            });
        } catch (error) {
            throw new Error('Error reading truck');
        }
    }

    async updateTruck(truck_id: number, updateData: Partial<Truck>): Promise<Truck | null> {
        try {
            const result = await this.truckRepo.update(truck_id, updateData);
            if (result.affected === 0) return null;

            const updatedTruck = await this.truckRepo.findOne({
                where: { truck_id },
                relations: ['company', 'repairs', 'truckTrips'],
            });
            return updatedTruck;
        } catch (error) {
            throw new Error('Error updating truck');
        }
    }

    async deleteTruck(truck_id: number): Promise<boolean> {
        try {
            const result = await this.truckRepo.delete(truck_id);
            return result.affected !== 0;
        } catch (error) {
            throw new Error('Error deleting truck');
        }
    }

    async readAllTrucks(): Promise<Truck[]> {
        try {
            return await this.truckRepo.find({ relations: ['company', 'repairs', 'truckTrips'] });
        } catch (error) {
            throw new Error('Error reading all trucks');
        }
    }
}
