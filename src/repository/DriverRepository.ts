import { Repository, EntityTarget, EntityManager } from 'typeorm';
import { Driver } from '../entity/Driver';

export class DriverRepository {
    private driverRepo: Repository<Driver>;

    constructor(entity: EntityTarget<Driver>, manager: EntityManager) {
        this.driverRepo = manager.getRepository(entity);
    }

    async createDriver(driver: Driver): Promise<Driver> {
        try {
            return await this.driverRepo.save(driver);
        } catch (error) {
            console.error('Error creating driver:', error);
            throw new Error('Error creating driver');
        }
    }

    async readDriver(driver_id: number): Promise<Driver | null> {
        try {
            return await this.driverRepo.findOne({
                where: { driver_id },
                relations: ['employee', 'truckTrips1', 'truckTrips2'],
            });
        } catch (error) {
            console.error('Error reading driver:', error);
            throw new Error('Error reading driver');
        }
    }

    async updateDriver(driver_id: number, updateData: Partial<Driver>): Promise<Driver | null> {
        try {
            const result = await this.driverRepo.update(driver_id, updateData);
            if (result.affected === 0) return null;
            return await this.driverRepo.findOne({
                where: { driver_id },
                relations: ['employee', 'truckTrips1', 'truckTrips2'],
            });
        } catch (error) {
            console.error('Error updating driver:', error);
            throw new Error('Error updating driver');
        }
    }

    async deleteDriver(driver_id: number): Promise<boolean> {
        try {
            const result = await this.driverRepo.delete(driver_id);
            return result.affected !== 0;
        } catch (error) {
            console.error('Error deleting driver:', error);
            throw new Error('Error deleting driver');
        }
    }

    async readAllDrivers(): Promise<Driver[]> {
        try {
            return await this.driverRepo.find({ relations: ['employee', 'truckTrips1', 'truckTrips2'] });
        } catch (error) {
            console.error('Error reading all drivers:', error);
            throw new Error('Error reading all drivers');
        }
    }
}


