import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { TruckTrip } from '../entity/TruckTrip';
import { TruckTripRepository } from '../repository/TruckTripRepository';

const router = Router();
const truckTripRepo = AppDataSource.getRepository(TruckTrip);

// Get all truck trips
router.get('/', async (req, res) => {
  try {
    const truckTrips = await truckTripRepo.find({ relations: ['truck', 'driver1', 'driver2', 'shipments'] });
    res.json(truckTrips);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get a single truck trip by ID
router.get('/:truck_trip_id', async (req, res) => {
  try {
    const { truck_trip_id } = req.params;
    const truckTrip = await truckTripRepo.findOne({ where: { truck_trip_id: parseInt(truck_trip_id, 10) }, relations: ['truck', 'driver1', 'driver2', 'shipments'] });
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
    const truckTrip = truckTripRepo.create(req.body);
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
    const truckTrip = await truckTripRepo.findOne({ where: { truck_trip_id: parseInt(truck_trip_id, 10) }, relations: ['truck', 'driver1', 'driver2', 'shipments'] });
    if (!truckTrip) {
      return res.status(404).json({ message: 'TruckTrip not found' });
    }
    // Merge with existing data and save
    Object.assign(truckTrip, req.body);
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
    const truckTrip = await truckTripRepo.findOne({ where: { truck_trip_id: parseInt(truck_trip_id, 10) } });
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
