import { Repository, EntityManager } from 'typeorm';
import { TruckTrip } from '../../entity/TruckTrip';
import { TruckTripRepository } from '../../repository/TruckTripRepository';
import { instance, mock, when, verify, reset, deepEqual } from 'ts-mockito';

describe('TruckTripRepository Unit Tests', () => {
    let truckTripRepository: TruckTripRepository;
    let mockTruckTripRepo: Repository<TruckTrip>;
    let mockEntityManager: EntityManager;

    beforeEach(() => {
        mockTruckTripRepo = mock<Repository<TruckTrip>>();
        mockEntityManager = mock<EntityManager>();
        when(mockEntityManager.getRepository(TruckTrip)).thenReturn(instance(mockTruckTripRepo));
        truckTripRepository = new TruckTripRepository(TruckTrip, instance(mockEntityManager));
    });

    afterEach(() => {
        reset(mockTruckTripRepo);
    });

    it('should create a new truck trip', async () => {
        const truckTripData: Partial<TruckTrip> = { route: 'Route 66' };
        const savedTruckTrip = { ...truckTripData, truck_trip_id: 1 } as TruckTrip;
        when(mockTruckTripRepo.save(deepEqual(truckTripData))).thenResolve(savedTruckTrip);

        const newTruckTrip = await truckTripRepository.createTruckTrip(truckTripData as TruckTrip);

        expect(newTruckTrip).toEqual(savedTruckTrip);
        verify(mockTruckTripRepo.save(deepEqual(truckTripData))).once();
    });

    it('should throw an error when creating a truck trip fails', async () => {
        const truckTripData: Partial<TruckTrip> = { route: 'Route 66' };
        when(mockTruckTripRepo.save(deepEqual(truckTripData))).thenThrow(new Error('Database error'));

        await expect(truckTripRepository.createTruckTrip(truckTripData as TruckTrip)).rejects.toThrow('Error creating truck trip');
    });

    it('should read a truck trip by id with truck, drivers, and shipments', async () => {
        const truckTripData = { truck_trip_id: 1, route: 'Route 66' } as TruckTrip;
        when(mockTruckTripRepo.findOne(deepEqual({ where: { truck_trip_id: 1 }, relations: ['truck', 'driver1', 'driver2', 'shipments'] }))).thenResolve(truckTripData);

        const foundTruckTrip = await truckTripRepository.readTruckTrip(1);

        expect(foundTruckTrip).toEqual(truckTripData);
        verify(mockTruckTripRepo.findOne(deepEqual({ where: { truck_trip_id: 1 }, relations: ['truck', 'driver1', 'driver2', 'shipments'] }))).once();
    });

    it('should return null when reading a non-existent truck trip', async () => {
        when(mockTruckTripRepo.findOne(deepEqual({ where: { truck_trip_id: 999 }, relations: ['truck', 'driver1', 'driver2', 'shipments'] }))).thenResolve(null);

        const foundTruckTrip = await truckTripRepository.readTruckTrip(999);

        expect(foundTruckTrip).toBeNull();
        verify(mockTruckTripRepo.findOne(deepEqual({ where: { truck_trip_id: 999 }, relations: ['truck', 'driver1', 'driver2', 'shipments'] }))).once();
    });

    it('should update a truck trip', async () => {
        const updateData: Partial<TruckTrip> = { route: 'Updated Route' };
        const updatedTruckTrip = { truck_trip_id: 1, route: 'Updated Route' } as TruckTrip;
        when(mockTruckTripRepo.update(1, deepEqual(updateData))).thenResolve({ affected: 1 } as any);
        when(mockTruckTripRepo.findOne(deepEqual({ where: { truck_trip_id: 1 }, relations: ['truck', 'driver1', 'driver2', 'shipments'] }))).thenResolve(updatedTruckTrip);

        const result = await truckTripRepository.updateTruckTrip(1, updateData);

        expect(result).toEqual(updatedTruckTrip);
        verify(mockTruckTripRepo.update(1, deepEqual(updateData))).once();
        verify(mockTruckTripRepo.findOne(deepEqual({ where: { truck_trip_id: 1 }, relations: ['truck', 'driver1', 'driver2', 'shipments'] }))).once();
    });

    it('should return null when updating a non-existent truck trip', async () => {
        const updateData: Partial<TruckTrip> = { route: 'Updated Route' };
        when(mockTruckTripRepo.update(999, deepEqual(updateData))).thenResolve({ affected: 0 } as any);

        const result = await truckTripRepository.updateTruckTrip(999, updateData);

        expect(result).toBeNull();
        verify(mockTruckTripRepo.update(999, deepEqual(updateData))).once();
    });

    it('should delete a truck trip', async () => {
        when(mockTruckTripRepo.delete(1)).thenResolve({ affected: 1 } as any);

        const result = await truckTripRepository.deleteTruckTrip(1);

        expect(result).toBe(true);
        verify(mockTruckTripRepo.delete(1)).once();
    });

    it('should return false when deleting a non-existent truck trip', async () => {
        when(mockTruckTripRepo.delete(999)).thenResolve({ affected: 0 } as any);

        const result = await truckTripRepository.deleteTruckTrip(999);

        expect(result).toBe(false);
        verify(mockTruckTripRepo.delete(999)).once();
    });

    it('should read all truck trips with truck, drivers, and shipments', async () => {
        const truckTrips = [
            { truck_trip_id: 1, route: 'Route 66' },
            { truck_trip_id: 2, route: 'Route 67' },
        ] as TruckTrip[];
        when(mockTruckTripRepo.find(deepEqual({ relations: ['truck', 'driver1', 'driver2', 'shipments'] }))).thenResolve(truckTrips);

        const result = await truckTripRepository.readAllTruckTrips();

        expect(result).toEqual(truckTrips);
        verify(mockTruckTripRepo.find(deepEqual({ relations: ['truck', 'driver1', 'driver2', 'shipments'] }))).once();
    });

    it('should throw an error when reading all truck trips fails', async () => {
        when(mockTruckTripRepo.find(deepEqual({ relations: ['truck', 'driver1', 'driver2', 'shipments'] }))).thenThrow(new Error('Database error'));

        await expect(truckTripRepository.readAllTruckTrips()).rejects.toThrow('Error reading all truck trips');
    });
});
