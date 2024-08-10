import { Repository, EntityManager } from 'typeorm';
import { Driver } from '../../entity/Driver';
import { DriverRepository } from '../../repository/DriverRepository';
import { instance, mock, when, verify, reset, deepEqual } from 'ts-mockito';

describe('DriverRepository Unit Tests', () => {
    let driverRepository: DriverRepository;
    let mockDriverRepo: Repository<Driver>;
    let mockEntityManager: EntityManager;

    // Initialize mock repositories and the DriverRepository before each test
    beforeEach(() => {
        mockDriverRepo = mock<Repository<Driver>>();
        mockEntityManager = mock<EntityManager>();
        when(mockEntityManager.getRepository(Driver)).thenReturn(instance(mockDriverRepo));
        driverRepository = new DriverRepository(Driver, instance(mockEntityManager));
    });

    // Reset mocks after each test to ensure isolation
    afterEach(() => {
        reset(mockDriverRepo);
    });

    // Test the happy path of creating a new driver
    it('should create a new driver', async () => {
        const driverData: Partial<Driver> = { driver_category: 'Regular Driver', employee: { employee_id: 1 } as any, truckTrips1: [], truckTrips2: [] };
        const savedDriver = { ...driverData, driver_id: 1 } as Driver;
        when(mockDriverRepo.save(deepEqual(driverData))).thenResolve(savedDriver);

        const newDriver = await driverRepository.createDriver(driverData as Driver);

        expect(newDriver).toEqual(savedDriver);
        verify(mockDriverRepo.save(deepEqual(driverData))).once();
    });

    // Test the negative case where creating a driver fails
    it('should throw an error when creating a driver fails', async () => {
        const driverData: Partial<Driver> = { driver_category: 'Regular Driver', employee: { employee_id: 1 } as any, truckTrips1: [], truckTrips2: [] };
        when(mockDriverRepo.save(deepEqual(driverData))).thenThrow(new Error('Database error'));

        await expect(driverRepository.createDriver(driverData as Driver)).rejects.toThrow('Error creating driver');
    });

    // Test the happy path of reading a driver by ID with employee and truck trips
    it('should read a driver by id with employee and truck trips', async () => {
        const driverData = { driver_id: 1, driver_category: 'Test Category', employee: { employee_id: 1 } as any, truckTrips1: [], truckTrips2: [] } as Driver;
        when(mockDriverRepo.findOne(deepEqual({ where: { driver_id: 1 }, relations: ['employee', 'truckTrips1', 'truckTrips2'] }))).thenResolve(driverData);

        const foundDriver = await driverRepository.readDriver(1);

        expect(foundDriver).toEqual(driverData);
        verify(mockDriverRepo.findOne(deepEqual({ where: { driver_id: 1 }, relations: ['employee', 'truckTrips1', 'truckTrips2'] }))).once();
    });

    // Test the edge case where the driver ID does not exist
    it('should return null when reading a non-existent driver', async () => {
        when(mockDriverRepo.findOne(deepEqual({ where: { driver_id: 999 }, relations: ['employee', 'truckTrips1', 'truckTrips2'] }))).thenResolve(null);

        const foundDriver = await driverRepository.readDriver(999);

        expect(foundDriver).toBeNull();
        verify(mockDriverRepo.findOne(deepEqual({ where: { driver_id: 999 }, relations: ['employee', 'truckTrips1', 'truckTrips2'] }))).once();
    });

    // Test the happy path of updating a driver
    it('should update a driver', async () => {
        const updateData: Partial<Driver> = { driver_category: 'Regular Driver' };
        const updatedDriver = { driver_id: 1, driver_category: 'Regular Driver', employee: { employee_id: 1 } as any, truckTrips1: [], truckTrips2: [] } as Driver;
        when(mockDriverRepo.update(1, deepEqual(updateData))).thenResolve({ affected: 1 } as any);
        when(mockDriverRepo.findOne(deepEqual({ where: { driver_id: 1 }, relations: ['employee', 'truckTrips1', 'truckTrips2'] }))).thenResolve(updatedDriver);

        const result = await driverRepository.updateDriver(1, updateData);

        expect(result).toEqual(updatedDriver);
        verify(mockDriverRepo.update(1, deepEqual(updateData))).once();
        verify(mockDriverRepo.findOne(deepEqual({ where: { driver_id: 1 }, relations: ['employee', 'truckTrips1', 'truckTrips2'] }))).once();
    });

    // Test the edge case where the driver ID to update does not exist
    it('should return null when updating a non-existent driver', async () => {
        const updateData: Partial<Driver> = { driver_category: 'Occasional Driver' };
        when(mockDriverRepo.update(999, deepEqual(updateData))).thenResolve({ affected: 0 } as any);

        const result = await driverRepository.updateDriver(999, updateData);

        expect(result).toBeNull();
        verify(mockDriverRepo.update(999, deepEqual(updateData))).once();
    });

    // Test the happy path of deleting a driver
    it('should delete a driver', async () => {
        when(mockDriverRepo.delete(1)).thenResolve({ affected: 1 } as any);

        const result = await driverRepository.deleteDriver(1);

        expect(result).toBe(true);
        verify(mockDriverRepo.delete(1)).once();
    });

    // Test the edge case where the driver ID to delete does not exist
    it('should return false when deleting a non-existent driver', async () => {
        when(mockDriverRepo.delete(999)).thenResolve({ affected: 0 } as any);

        const result = await driverRepository.deleteDriver(999);

        expect(result).toBe(false);
        verify(mockDriverRepo.delete(999)).once();
    });

    // Test the happy path of reading all drivers with their employees and truck trips
    it('should read all drivers with employees and truck trips', async () => {
        const drivers = [
            { driver_id: 1, driver_category: 'Regular Driver', employee: { employee_id: 1 } as any, truckTrips1: [], truckTrips2: [] },
            { driver_id: 2, driver_category: 'Occasional Driver', employee: { employee_id: 2 } as any, truckTrips1: [], truckTrips2: [] },
        ] as Driver[];
        when(mockDriverRepo.find(deepEqual({ relations: ['employee', 'truckTrips1', 'truckTrips2'] }))).thenResolve(drivers);

        const result = await driverRepository.readAllDrivers();

        expect(result).toEqual(drivers);
        verify(mockDriverRepo.find(deepEqual({ relations: ['employee', 'truckTrips1', 'truckTrips2'] }))).once();
    });

    // Test the negative case where reading all drivers fails
    it('should throw an error when reading all drivers fails', async () => {
        when(mockDriverRepo.find(deepEqual({ relations: ['employee', 'truckTrips1', 'truckTrips2'] }))).thenThrow(new Error('Database error'));

        await expect(driverRepository.readAllDrivers()).rejects.toThrow('Error reading all drivers');
    });
});
