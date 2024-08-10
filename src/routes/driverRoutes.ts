import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Driver } from '../entity/Driver';
import { Employee } from '../entity/Employee';
import { TruckTrip } from '../entity/TruckTrip';

const router = Router();

// Get all drivers
router.get('/', async (req, res) => {
    try {
        const drivers = await AppDataSource.getRepository(Driver).find({ relations: ['employee', 'truckTrips1', 'truckTrips2'] });
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});
// Get a single driver by ID
router.get('/:driver_id', async (req, res) => {
    try {
        const { driver_id } = req.params;
        const driver = await AppDataSource.getRepository(Driver).findOne({
            where: { driver_id: parseInt(driver_id) },
            relations: ['employee', 'truckTrips1', 'truckTrips1.shipments', 'truckTrips2', 'truckTrips2.shipments']
        });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Create a new driver
router.post('/', async (req, res) => {
    try {
        const { employee_id, driver_category } = req.body;

        const employee = await AppDataSource.getRepository(Employee).findOne({ where: { employee_id: parseInt(employee_id) } });
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found' });
        }

        const newDriver = new Driver();
        newDriver.employee = employee;
        newDriver.driver_category = driver_category;

        const result = await AppDataSource.getRepository(Driver).save(newDriver);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Update a driver by ID
router.put('/:driver_id', async (req, res) => {
    try {
        const { driver_id } = req.params;
        const { employee_id, driver_category } = req.body;

        const driver = await AppDataSource.getRepository(Driver).findOne({ 
            where: { driver_id: parseInt(driver_id) }, 
            relations: ['employee', 'truckTrips1', 'truckTrips2'] 
        });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        if (employee_id) {
            const employee = await AppDataSource.getRepository(Employee).findOne({ where: { employee_id: parseInt(employee_id) } });
            if (!employee) {
                return res.status(400).json({ message: 'Employee not found' });
            }
            driver.employee = employee;
        }

        if (driver_category) {
            driver.driver_category = driver_category;
        }

        const result = await AppDataSource.getRepository(Driver).save(driver);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Delete a driver by ID
router.delete('/:driver_id', async (req, res) => {
    try {
        const { driver_id } = req.params;
        const driver = await AppDataSource.getRepository(Driver).findOne({ 
            where: { driver_id: parseInt(driver_id) }, 
            relations: ['employee', 'truckTrips1', 'truckTrips2'] 
        });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await AppDataSource.getRepository(Driver).remove(driver);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get drivers by employee ID
router.get('/employee/:employee_id', async (req, res) => {
    try {
        const { employee_id } = req.params;
        const drivers = await AppDataSource.getRepository(Driver).find({
            where: {
                employee: {
                    employee_id: parseInt(employee_id)
                }
            },
            relations: ['employee', 'truckTrips1', 'truckTrips2']
        });
        if (drivers.length > 0) {
            res.json(drivers);
        } else {
            res.status(404).json({ message: 'No drivers found for the given employee ID' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get truck trips for driver 1 by driver ID
router.get('/:driver_id/truckTrips1', async (req, res) => {
    try {
        const { driver_id } = req.params;
        const driver = await AppDataSource.getRepository(Driver).findOne({ where: { driver_id: parseInt(driver_id) }, relations: ['truckTrips1'] });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver.truckTrips1);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get truck trips for driver 2 by driver ID
router.get('/:driver_id/truckTrips2', async (req, res) => {
    try {
        const { driver_id } = req.params;
        const driver = await AppDataSource.getRepository(Driver).findOne({ where: { driver_id: parseInt(driver_id) }, relations: ['truckTrips2'] });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver.truckTrips2);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router;
