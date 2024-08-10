import { Repository, EntityTarget, EntityManager } from 'typeorm';
import { TruckTrip } from '../entity/TruckTrip';

export class TruckTripRepository {
    private truckTripRepo: Repository<TruckTrip>;

    constructor(entity: EntityTarget<TruckTrip>, manager: EntityManager) {
        this.truckTripRepo = manager.getRepository(entity);
    }

    async createTruckTrip(truckTrip: TruckTrip): Promise<TruckTrip> {
        try {
            return await this.truckTripRepo.save(truckTrip);
        } catch (error) {
            throw new Error('Error creating truck trip');
        }
    }

    async readTruckTrip(truck_trip_id: number): Promise<TruckTrip | null> {
        try {
            return await this.truckTripRepo.findOne({
                where: { truck_trip_id },
                relations: ['truck', 'driver1', 'driver2', 'shipments'],
            });
        } catch (error) {
            throw new Error('Error reading truck trip');
        }
    }

    async updateTruckTrip(truck_trip_id: number, updateData: Partial<TruckTrip>): Promise<TruckTrip | null> {
        try {
            const result = await this.truckTripRepo.update(truck_trip_id, updateData);
            if (result.affected === 0) return null;

            return await this.truckTripRepo.findOne({
                where: { truck_trip_id },
                relations: ['truck', 'driver1', 'driver2', 'shipments'],
            });
        } catch (error) {
            throw new Error('Error updating truck trip');
        }
    }

    async deleteTruckTrip(truck_trip_id: number): Promise<boolean> {
        try {
            const result = await this.truckTripRepo.delete(truck_trip_id);
            return result.affected !== 0;
        } catch (error) {
            throw new Error('Error deleting truck trip');
        }
    }

    async readAllTruckTrips(): Promise<TruckTrip[]> {
        try {
            return await this.truckTripRepo.find({ relations: ['truck', 'driver1', 'driver2', 'shipments'] });
        } catch (error) {
            throw new Error('Error reading all truck trips');
        }
    }
}
