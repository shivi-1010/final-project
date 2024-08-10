import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { TruckTrip } from '../entity/TruckTrip';
import { Truck } from '../entity/Truck';
import { Driver } from '../entity/Driver';

const router = Router();

// Get all truck trips
router.get('/', async (req, res) => {
    try {
        const truckTripRepo = AppDataSource.getRepository(TruckTrip);
        const truckTrips = await truckTripRepo.find({
            relations: ['truck', 'driver1', 'driver2', 'shipments'],
        });
        res.json(truckTrips);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get a single truck trip by ID
router.get('/:truck_trip_id', async (req, res) => {
    try {
        const { truck_trip_id } = req.params;
        const truckTripRepo = AppDataSource.getRepository(TruckTrip);
        const truckTrip = await truckTripRepo.findOne({
            where: { truck_trip_id: parseInt(truck_trip_id, 10) },
            relations: ['truck', 'driver1', 'driver2', 'shipments'],
        });
        if (!truckTrip) {
            return res.status(404).json({ message: 'TruckTrip not found' });
        }
        res.json(truckTrip);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Create a new truck trip
router.post('/', async (req, res) => {
    try {
        const truckTripRepo = AppDataSource.getRepository(TruckTrip);
        const truckTrip = new TruckTrip();

        truckTrip.route = req.body.route;

        // Validate and set related entities if necessary
        const truckRepo = AppDataSource.getRepository(Truck);
        if (req.body.truck_id) {
            const truck = await truckRepo.findOne({ where: { truck_id: req.body.truck_id } });
            if (truck) truckTrip.truck = truck;
        }

        const driverRepo = AppDataSource.getRepository(Driver);
        if (req.body.driver1_id) {
            const driver1 = await driverRepo.findOne({ where: { driver_id: req.body.driver1_id } });
            if (driver1) truckTrip.driver1 = driver1;
        }

        if (req.body.driver2_id) {
            const driver2 = await driverRepo.findOne({ where: { driver_id: req.body.driver2_id } });
            if (driver2) truckTrip.driver2 = driver2;
        }

        const result = await truckTripRepo.save(truckTrip);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Update a truck trip by ID
router.put('/:truck_trip_id', async (req, res) => {
    try {
        const { truck_trip_id } = req.params;
        const truckTripRepo = AppDataSource.getRepository(TruckTrip);
        const truckTrip = await truckTripRepo.findOne({
            where: { truck_trip_id: parseInt(truck_trip_id, 10) },
            relations: ['truck', 'driver1', 'driver2', 'shipments'],
        });

        if (!truckTrip) {
            return res.status(404).json({ message: 'TruckTrip not found' });
        }

        truckTrip.route = req.body.route;

        // Validate and set related entities if necessary
        const truckRepo = AppDataSource.getRepository(Truck);
        if (req.body.truck_id) {
            const truck = await truckRepo.findOne({ where: { truck_id: req.body.truck_id } });
            if (truck) truckTrip.truck = truck;
        }

        const driverRepo = AppDataSource.getRepository(Driver);
        if (req.body.driver1_id) {
            const driver1 = await driverRepo.findOne({ where: { driver_id: req.body.driver1_id } });
            if (driver1) truckTrip.driver1 = driver1;
        }

        if (req.body.driver2_id) {
            const driver2 = await driverRepo.findOne({ where: { driver_id: req.body.driver2_id } });
            if (driver2) truckTrip.driver2 = driver2;
        }

        const updatedTruckTrip = await truckTripRepo.save(truckTrip);
        res.json(updatedTruckTrip);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Delete a truck trip by ID
router.delete('/:truck_trip_id', async (req, res) => {
    try {
        const { truck_trip_id } = req.params;
        const truckTripRepo = AppDataSource.getRepository(TruckTrip);
        const truckTrip = await truckTripRepo.findOne({
            where: { truck_trip_id: parseInt(truck_trip_id, 10) },
            relations: ['truck', 'driver1', 'driver2', 'shipments'],
        });

        if (!truckTrip) {
            return res.status(404).json({ message: 'TruckTrip not found' });
        }

        await truckTripRepo.remove(truckTrip);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router;
