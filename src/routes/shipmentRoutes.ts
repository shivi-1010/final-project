import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Shipment } from '../entity/Shipment';
import { ShipmentRepository } from '../repository/ShipmentRepository';

const router = Router();

// Get all shipments
router.get('/', async (req, res) => {
    try {
        const shipmentRepo = AppDataSource.getRepository(Shipment);
        const shipments = await shipmentRepo.find();
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get a single shipment by ID
router.get('/:shipment_id', async (req, res) => {
    try {
        const { shipment_id } = req.params;
        const shipmentRepo = AppDataSource.getRepository(Shipment);
        const shipment = await shipmentRepo.findOne({
            where: { shipment_id: parseInt(shipment_id) },
            relations: ['customer', 'truckTrip'],
        });
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }
        res.json(shipment);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Create a new shipment
router.post('/', async (req, res) => {
    try {
        const shipmentRepo = AppDataSource.getRepository(Shipment);
        const shipment = shipmentRepo.create(req.body);
        const result = await shipmentRepo.save(shipment);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Update a shipment by ID
router.put('/:shipment_id', async (req, res) => {
    try {
        const { shipment_id } = req.params;
        const shipmentRepo = AppDataSource.getRepository(Shipment);
        const shipment = await shipmentRepo.findOneBy({ shipment_id: parseInt(shipment_id) });
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }
        shipmentRepo.merge(shipment, req.body);
        const updatedShipment = await shipmentRepo.save(shipment);
        res.json(updatedShipment);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Delete a shipment by ID
router.delete('/:shipment_id', async (req, res) => {
    try {
        const { shipment_id } = req.params;
        const shipmentRepo = AppDataSource.getRepository(Shipment);
        const shipment = await shipmentRepo.findOneBy({ shipment_id: parseInt(shipment_id) });
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }
        await shipmentRepo.remove(shipment);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router;
