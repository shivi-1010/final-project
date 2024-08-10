import { Repository, EntityManager } from 'typeorm';
import { TruckRepair } from '../../entity/TruckRepair';
import { TruckRepairRepository } from '../../repository/TruckRepairRepository';
import { instance, mock, when, verify, reset, deepEqual } from 'ts-mockito';

describe('TruckRepairRepository Unit Tests', () => {
    let truckRepairRepository: TruckRepairRepository;
    let mockTruckRepairRepo: Repository<TruckRepair>;
    let mockEntityManager: EntityManager;

    // Initialize mock repositories and the TruckRepairRepository before each test
    beforeEach(() => {
        mockTruckRepairRepo = mock<Repository<TruckRepair>>();
        mockEntityManager = mock<EntityManager>();
        when(mockEntityManager.getRepository(TruckRepair)).thenReturn(instance(mockTruckRepairRepo));
        truckRepairRepository = new TruckRepairRepository(TruckRepair, instance(mockEntityManager));
    });

    // Reset mocks after each test to ensure isolation
    afterEach(() => {
        reset(mockTruckRepairRepo);
    });

    // Test the happy path of creating a new truck repair
    it('should create a new truck repair', async () => {
        const truckRepairData: Partial<TruckRepair> = { 
            start_date: new Date(), 
            end_date: new Date(), 
            estimated_days: 5 
        };
        const savedTruckRepair = { ...truckRepairData, repair_id: 1 } as TruckRepair;
        when(mockTruckRepairRepo.save(deepEqual(truckRepairData))).thenResolve(savedTruckRepair);

        const newTruckRepair = await truckRepairRepository.createTruckRepair(truckRepairData as TruckRepair);

        expect(newTruckRepair).toEqual(savedTruckRepair);
        verify(mockTruckRepairRepo.save(deepEqual(truckRepairData))).once();
    });

    // Test the negative case where creating a truck repair fails
    it('should throw an error when creating a truck repair fails', async () => {
        const truckRepairData: Partial<TruckRepair> = { 
            start_date: new Date(), 
            end_date: new Date(), 
            estimated_days: 5 
        };
        when(mockTruckRepairRepo.save(deepEqual(truckRepairData))).thenThrow(new Error('Database error'));

        await expect(truckRepairRepository.createTruckRepair(truckRepairData as TruckRepair)).rejects.toThrow('Error creating truck repair');
    });

    // Test the happy path of reading a truck repair by ID with truck and mechanic relations
    it('should read a truck repair by id with truck and mechanic', async () => {
        const truckRepairData = { 
            repair_id: 1, 
            start_date: new Date(), 
            end_date: new Date(), 
            estimated_days: 5 
        } as TruckRepair;
        when(mockTruckRepairRepo.findOne(deepEqual({ where: { repair_id: 1 }, relations: ['truck', 'mechanic'] }))).thenResolve(truckRepairData);

        const foundTruckRepair = await truckRepairRepository.readTruckRepair(1);

        expect(foundTruckRepair).toEqual(truckRepairData);
        verify(mockTruckRepairRepo.findOne(deepEqual({ where: { repair_id: 1 }, relations: ['truck', 'mechanic'] }))).once();
    });

    // Test the edge case where the truck repair ID does not exist
    it('should return null when reading a non-existent truck repair', async () => {
        when(mockTruckRepairRepo.findOne(deepEqual({ where: { repair_id: 999 }, relations: ['truck', 'mechanic'] }))).thenResolve(null);

        const foundTruckRepair = await truckRepairRepository.readTruckRepair(999);

        expect(foundTruckRepair).toBeNull();
        verify(mockTruckRepairRepo.findOne(deepEqual({ where: { repair_id: 999 }, relations: ['truck', 'mechanic'] }))).once();
    });

    // Test the happy path of updating a truck repair
    it('should update a truck repair', async () => {
        const updateData: Partial<TruckRepair> = { estimated_days: 10 };
        const updatedTruckRepair = { 
            repair_id: 1, 
            start_date: new Date(), 
            end_date: new Date(), 
            estimated_days: 10 
        } as TruckRepair;
        when(mockTruckRepairRepo.update(1, deepEqual(updateData))).thenResolve({ affected: 1 } as any);
        when(mockTruckRepairRepo.findOne(deepEqual({ where: { repair_id: 1 }, relations: ['truck', 'mechanic'] }))).thenResolve(updatedTruckRepair);

        const result = await truckRepairRepository.updateTruckRepair(1, updateData);

        expect(result).toEqual(updatedTruckRepair);
        verify(mockTruckRepairRepo.update(1, deepEqual(updateData))).once();
        verify(mockTruckRepairRepo.findOne(deepEqual({ where: { repair_id: 1 }, relations: ['truck', 'mechanic'] }))).once();
    });

    // Test the edge case where the truck repair ID to update does not exist
    it('should return null when updating a non-existent truck repair', async () => {
        const updateData: Partial<TruckRepair> = { estimated_days: 10 };
        when(mockTruckRepairRepo.update(999, deepEqual(updateData))).thenResolve({ affected: 0 } as any);

        const result = await truckRepairRepository.updateTruckRepair(999, updateData);

        expect(result).toBeNull();
        verify(mockTruckRepairRepo.update(999, deepEqual(updateData))).once();
    });

    // Test the happy path of deleting a truck repair
    it('should delete a truck repair', async () => {
        when(mockTruckRepairRepo.delete(1)).thenResolve({ affected: 1 } as any);

        const result = await truckRepairRepository.deleteTruckRepair(1);

        expect(result).toBe(true);
        verify(mockTruckRepairRepo.delete(1)).once();
    });

    // Test the edge case where the truck repair ID to delete does not exist
    it('should return false when deleting a non-existent truck repair', async () => {
        when(mockTruckRepairRepo.delete(999)).thenResolve({ affected: 0 } as any);

        const result = await truckRepairRepository.deleteTruckRepair(999);

        expect(result).toBe(false);
        verify(mockTruckRepairRepo.delete(999)).once();
    });

    // Test the happy path of reading all truck repairs with their truck and mechanic relations
    it('should read all truck repairs with truck and mechanic', async () => {
        const truckRepairs = [
            { repair_id: 1, start_date: new Date(), end_date: new Date(), estimated_days: 5 },
            { repair_id: 2, start_date: new Date(), end_date: new Date(), estimated_days: 10 },
        ] as TruckRepair[];
        when(mockTruckRepairRepo.find(deepEqual({ relations: ['truck', 'mechanic'] }))).thenResolve(truckRepairs);

        const result = await truckRepairRepository.readAllTruckRepairs();

        expect(result).toEqual(truckRepairs);
        verify(mockTruckRepairRepo.find(deepEqual({ relations: ['truck', 'mechanic'] }))).once();
    });

    // Test the negative case where reading all truck repairs fails
    it('should throw an error when reading all truck repairs fails', async () => {
        when(mockTruckRepairRepo.find(deepEqual({ relations: ['truck', 'mechanic'] }))).thenThrow(new Error('Database error'));

        await expect(truckRepairRepository.readAllTruckRepairs()).rejects.toThrow('Error reading all truck repairs');
    });
});
