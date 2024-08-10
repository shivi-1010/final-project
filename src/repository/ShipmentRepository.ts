import { Repository, EntityTarget, EntityManager } from 'typeorm';
import { Shipment } from '../entity/Shipment';

export class ShipmentRepository {
    private shipmentRepo: Repository<Shipment>;

    constructor(entity: EntityTarget<Shipment>, manager: EntityManager) {
        this.shipmentRepo = manager.getRepository(entity);
    }

    async createShipment(shipment: Shipment): Promise<Shipment> {
        try {
            return await this.shipmentRepo.save(shipment);
        } catch (error) {
            throw new Error('Error creating shipment');
        }
    }

    async readShipment(shipment_id: number): Promise<Shipment | null> {
        try {
            return await this.shipmentRepo.findOne({
                where: { shipment_id },
                relations: ['customer', 'truckTrip'],
            });
        } catch (error) {
            throw new Error('Error reading shipment');
        }
    }

    async updateShipment(shipment_id: number, updateData: Partial<Shipment>): Promise<Shipment | null> {
        try {
            const result = await this.shipmentRepo.update(shipment_id, updateData);
            if (result.affected === 0) return null;

            const updatedShipment = await this.shipmentRepo.findOne({
                where: { shipment_id },
                relations: ['customer', 'truckTrip'],
            });
            return updatedShipment;
        } catch (error) {
            throw new Error('Error updating shipment');
        }
    }

    async deleteShipment(shipment_id: number): Promise<boolean> {
        try {
            const result = await this.shipmentRepo.delete(shipment_id);
            return result.affected !== 0;
        } catch (error) {
            throw new Error('Error deleting shipment');
        }
    }

    async readAllShipments(): Promise<Shipment[]> {
        try {
            return await this.shipmentRepo.find({ relations: ['customer', 'truckTrip'] });
        } catch (error) {
            throw new Error('Error reading all shipments');
        }
    }
}
