import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Mechanic } from '../entity/Mechanic';
import { Employee } from '../entity/Employee';

const router = Router();

// Helper function to handle unknown errors
function handleError(res: any, error: unknown) {
    if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
}

// Get all mechanics
router.get('/', async (req, res) => {
    try {
        const mechanics = await AppDataSource.getRepository(Mechanic).find({ relations: ['employee', 'truckRepairs'] });
        res.json(mechanics);
    } catch (error) {
        handleError(res, error);
    }
});

// Get a single mechanic by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const mechanicId = parseInt(id);
        if (isNaN(mechanicId) || mechanicId <= 0) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const mechanic = await AppDataSource.getRepository(Mechanic).findOne({ where: { mechanic_id: mechanicId }, relations: ['employee', 'truckRepairs'] });
        if (mechanic) {
            res.json(mechanic);
        } else {
            res.status(404).json({ message: 'Mechanic not found' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Create a new mechanic
router.post('/', async (req, res) => {
    try {
        const { employee_id, specialized_brand } = req.body;
        const employeeId = parseInt(employee_id);
        if (isNaN(employeeId) || employeeId <= 0) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        const employee = await AppDataSource.getRepository(Employee).findOne({ where: { employee_id: employeeId } });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const mechanic = new Mechanic();
        mechanic.specialized_brand = specialized_brand;
        mechanic.employee = employee;

        const result = await AppDataSource.getRepository(Mechanic).save(mechanic);
        res.status(201).json(result);
    } catch (error) {
        handleError(res, error);
    }
});

// Update a mechanic by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const mechanicId = parseInt(id);
        if (isNaN(mechanicId) || mechanicId <= 0) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const { specialized_brand } = req.body;
        const mechanic = await AppDataSource.getRepository(Mechanic).findOne({ where: { mechanic_id: mechanicId }, relations: ['employee', 'truckRepairs'] });

        if (mechanic) {
            mechanic.specialized_brand = specialized_brand;
            const result = await AppDataSource.getRepository(Mechanic).save(mechanic);
            res.json(result);
        } else {
            res.status(404).json({ message: 'Mechanic not found' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Delete a mechanic by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const mechanicId = parseInt(id);
        if (isNaN(mechanicId) || mechanicId <= 0) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const result = await AppDataSource.getRepository(Mechanic).delete(mechanicId);
        if (result.affected) {
            res.json({ message: 'Mechanic deleted' });
        } else {
            res.status(404).json({ message: 'Mechanic not found' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

export default router;
