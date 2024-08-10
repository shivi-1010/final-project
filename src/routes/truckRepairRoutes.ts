import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { TruckRepair } from '../entity/TruckRepair';

const router = Router();

// Get all truck repairs
router.get('/', async (req, res) => {
    try {
        const repairs = await AppDataSource.getRepository(TruckRepair).find({ relations: ['truck', 'mechanic'] });
        res.json(repairs);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get a single truck repair by ID
router.get('/:repair_id', async (req, res) => {
    try {
        const { repair_id } = req.params;
        const repair = await AppDataSource.getRepository(TruckRepair).findOne({ where: { repair_id: parseInt(repair_id) }, relations: ['truck', 'mechanic'] });
        if (!repair) {
            return res.status(404).json({ message: 'Truck repair not found' });
        }
        res.json(repair);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Create a new truck repair
router.post('/', async (req, res) => {
    try {
        const repair = await AppDataSource.getRepository(TruckRepair).save(req.body);
        res.status(201).json(repair);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Update a truck repair by ID
router.put('/:repair_id', async (req, res) => {
    try {
        const { repair_id } = req.params;
        const repair = await AppDataSource.getRepository(TruckRepair).findOne({ where: { repair_id: parseInt(repair_id) }, relations: ['truck', 'mechanic'] });
        if (!repair) {
            return res.status(404).json({ message: 'Truck repair not found' });
        }
        await AppDataSource.getRepository(TruckRepair).update(repair_id, req.body);
        const updatedRepair = await AppDataSource.getRepository(TruckRepair).findOne({ where: { repair_id: parseInt(repair_id) }, relations: ['truck', 'mechanic'] });
        res.json(updatedRepair);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Delete a truck repair by ID
router.delete('/:repair_id', async (req, res) => {
    try {
        const { repair_id } = req.params;
        const repair = await AppDataSource.getRepository(TruckRepair).findOne({ where: { repair_id: parseInt(repair_id) }, relations: ['truck', 'mechanic'] });
        if (!repair) {
            return res.status(404).json({ message: 'Truck repair not found' });
        }
        await AppDataSource.getRepository(TruckRepair).delete(repair_id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router;
