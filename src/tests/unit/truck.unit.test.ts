import { Repository, EntityManager } from 'typeorm';
import { Truck } from '../../entity/Truck';
import { TruckRepository } from '../../repository/TruckRepository';
import { instance, mock, when, verify, reset, deepEqual } from 'ts-mockito';

describe('TruckRepository Unit Tests', () => {
    let truckRepository: TruckRepository;
    let mockTruckRepo: Repository<Truck>;
    let mockEntityManager: EntityManager;

    // Initialize mock repositories and the TruckRepository before each test
    beforeEach(() => {
        mockTruckRepo = mock<Repository<Truck>>();
        mockEntityManager = mock<EntityManager>();
        when(mockEntityManager.getRepository(Truck)).thenReturn(instance(mockTruckRepo));
        truckRepository = new TruckRepository(Truck, instance(mockEntityManager));
    });

    // Reset mocks after each test to ensure isolation
    afterEach(() => {
        reset(mockTruckRepo);
    });

    // Test the happy path of creating a new truck
    it('should create a new truck', async () => {
        const truckData: Partial<Truck> = { brand: 'Ford', load: 1000, truck_capacity: 2000, year: 2020, number_of_repairs: 0 };
        const savedTruck = { ...truckData, truck_id: 1 } as Truck;
        when(mockTruckRepo.save(deepEqual(truckData))).thenResolve(savedTruck);

        const newTruck = await truckRepository.createTruck(truckData as Truck);

        expect(newTruck).toEqual(savedTruck);
        verify(mockTruckRepo.save(deepEqual(truckData))).once();
    });

    // Test the negative case where creating a truck fails
    it('should throw an error when creating a truck fails', async () => {
        const truckData: Partial<Truck> = { brand: 'Ford', load: 1000, truck_capacity: 2000, year: 2020, number_of_repairs: 0 };
        when(mockTruckRepo.save(deepEqual(truckData))).thenThrow(new Error('Database error'));

        await expect(truckRepository.createTruck(truckData as Truck)).rejects.toThrow('Error creating truck');
    });

    // Test the happy path of reading a truck by ID with company, repairs, and truckTrips
    it('should read a truck by id with company, repairs, and truckTrips', async () => {
        const truckData = { truck_id: 1, brand: 'Ford', load: 1000, truck_capacity: 2000, year: 2020, number_of_repairs: 0 } as Truck;
        when(mockTruckRepo.findOne(deepEqual({ where: { truck_id: 1 }, relations: ['company', 'repairs', 'truckTrips'] }))).thenResolve(truckData);

        const foundTruck = await truckRepository.readTruck(1);

        expect(foundTruck).toEqual(truckData);
        verify(mockTruckRepo.findOne(deepEqual({ where: { truck_id: 1 }, relations: ['company', 'repairs', 'truckTrips'] }))).once();
    });

    // Test the edge case where the truck ID does not exist
    it('should return null when reading a non-existent truck', async () => {
        when(mockTruckRepo.findOne(deepEqual({ where: { truck_id: 999 }, relations: ['company', 'repairs', 'truckTrips'] }))).thenResolve(null);

        const foundTruck = await truckRepository.readTruck(999);

        expect(foundTruck).toBeNull();
        verify(mockTruckRepo.findOne(deepEqual({ where: { truck_id: 999 }, relations: ['company', 'repairs', 'truckTrips'] }))).once();
    });

    // Test the happy path of updating a truck
    it('should update a truck', async () => {
        const updateData: Partial<Truck> = { brand: 'UpdatedBrand' };
        const updatedTruck = { truck_id: 1, brand: 'UpdatedBrand', load: 1000, truck_capacity: 2000, year: 2020, number_of_repairs: 0 } as Truck;
        when(mockTruckRepo.update(1, deepEqual(updateData))).thenResolve({ affected: 1 } as any);
        when(mockTruckRepo.findOne(deepEqual({ where: { truck_id: 1 }, relations: ['company', 'repairs', 'truckTrips'] }))).thenResolve(updatedTruck);

        const result = await truckRepository.updateTruck(1, updateData);

        expect(result).toEqual(updatedTruck);
        verify(mockTruckRepo.update(1, deepEqual(updateData))).once();
        verify(mockTruckRepo.findOne(deepEqual({ where: { truck_id: 1 }, relations: ['company', 'repairs', 'truckTrips'] }))).once();
    });

    // Test the edge case where the truck ID to update does not exist
    it('should return null when updating a non-existent truck', async () => {
        const updateData: Partial<Truck> = { brand: 'UpdatedBrand' };
        when(mockTruckRepo.update(999, deepEqual(updateData))).thenResolve({ affected: 0 } as any);

        const result = await truckRepository.updateTruck(999, updateData);

        expect(result).toBeNull();
        verify(mockTruckRepo.update(999, deepEqual(updateData))).once();
    });

    // Test the happy path of deleting a truck
    it('should delete a truck', async () => {
        when(mockTruckRepo.delete(1)).thenResolve({ affected: 1 } as any);

        const result = await truckRepository.deleteTruck(1);

        expect(result).toBe(true);
        verify(mockTruckRepo.delete(1)).once();
    });

    // Test the edge case where the truck ID to delete does not exist
    it('should return false when deleting a non-existent truck', async () => {
        when(mockTruckRepo.delete(999)).thenResolve({ affected: 0 } as any);

        const result = await truckRepository.deleteTruck(999);

        expect(result).toBe(false);
        verify(mockTruckRepo.delete(999)).once();
    });

    // Test the happy path of reading all trucks with their company, repairs, and truckTrips
    it('should read all trucks with company, repairs, and truckTrips', async () => {
        const trucks = [
            { truck_id: 1, brand: 'Ford', load: 1000, truck_capacity: 2000, year: 2020, number_of_repairs: 0 },
            { truck_id: 2, brand: 'Chevrolet', load: 1200, truck_capacity: 2500, year: 2021, number_of_repairs: 1 },
        ] as Truck[];
        when(mockTruckRepo.find(deepEqual({ relations: ['company', 'repairs', 'truckTrips'] }))).thenResolve(trucks);

        const result = await truckRepository.readAllTrucks();

        expect(result).toEqual(trucks);
        verify(mockTruckRepo.find(deepEqual({ relations: ['company', 'repairs', 'truckTrips'] }))).once();
    });

    // Test the negative case where reading all trucks fails
    it('should throw an error when reading all trucks fails', async () => {
        when(mockTruckRepo.find(deepEqual({ relations: ['company', 'repairs', 'truckTrips'] }))).thenThrow(new Error('Database error'));

        await expect(truckRepository.readAllTrucks()).rejects.toThrow('Error reading all trucks');
    });
});
