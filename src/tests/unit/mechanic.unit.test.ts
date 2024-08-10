import { Repository, EntityManager } from 'typeorm';
import { Mechanic } from '../../entity/Mechanic';
import { MechanicRepository } from '../../repository/MechanicRepository';
import { Employee } from '../../entity/Employee';
import { instance, mock, when, verify, reset, deepEqual } from 'ts-mockito';

describe('MechanicRepository Unit Tests', () => {
    let mechanicRepository: MechanicRepository;
    let mockMechanicRepo: Repository<Mechanic>;
    let mockEmployeeRepo: Repository<Employee>;
    let mockEntityManager: EntityManager;

    // Initialize mock repositories and the MechanicRepository before each test
    beforeEach(() => {
        mockMechanicRepo = mock<Repository<Mechanic>>();
        mockEmployeeRepo = mock<Repository<Employee>>();
        mockEntityManager = mock<EntityManager>();
        when(mockEntityManager.getRepository(Mechanic)).thenReturn(instance(mockMechanicRepo));
        when(mockEntityManager.getRepository(Employee)).thenReturn(instance(mockEmployeeRepo));
        mechanicRepository = new MechanicRepository(Mechanic, instance(mockEntityManager));
    });

    // Reset mocks after each test to ensure isolation
    afterEach(() => {
        reset(mockMechanicRepo);
        reset(mockEmployeeRepo);
    });

    // Test the happy path of creating a new mechanic
    it('should create a new mechanic', async () => {
        const mechanicData: Partial<Mechanic> = { specialized_brand: 'Toyota', employee: { employee_id: 1 } as Employee };
        const savedMechanic = { ...mechanicData, mechanic_id: 1 } as Mechanic;
        when(mockMechanicRepo.save(deepEqual(mechanicData))).thenResolve(savedMechanic);

        const newMechanic = await mechanicRepository.createMechanic(mechanicData as Mechanic);

        expect(newMechanic).toEqual(savedMechanic);
        verify(mockMechanicRepo.save(deepEqual(mechanicData))).once();
    });

    // Test the negative case where creating a mechanic fails
    it('should throw an error when creating a mechanic fails', async () => {
        const mechanicData: Partial<Mechanic> = { specialized_brand: 'Toyota', employee: { employee_id: 1 } as Employee };
        when(mockMechanicRepo.save(deepEqual(mechanicData))).thenThrow(new Error('Database error'));

        await expect(mechanicRepository.createMechanic(mechanicData as Mechanic)).rejects.toThrow('Error creating mechanic');
    });

    // Test the happy path of reading a mechanic by ID with employee and truck repairs
    it('should read a mechanic by id with employee and truck repairs', async () => {
        const mechanicData = { mechanic_id: 1, specialized_brand: 'Toyota', employee: { employee_id: 1 } as Employee, truckRepairs: [] } as Mechanic;
        when(mockMechanicRepo.findOne(deepEqual({ where: { mechanic_id: 1 }, relations: ['employee', 'truckRepairs'] }))).thenResolve(mechanicData);

        const foundMechanic = await mechanicRepository.readMechanic(1);

        expect(foundMechanic).toEqual(mechanicData);
        verify(mockMechanicRepo.findOne(deepEqual({ where: { mechanic_id: 1 }, relations: ['employee', 'truckRepairs'] }))).once();
    });

    // Test the edge case where the mechanic ID does not exist
    it('should return null when reading a non-existent mechanic', async () => {
        when(mockMechanicRepo.findOne(deepEqual({ where: { mechanic_id: 999 }, relations: ['employee', 'truckRepairs'] }))).thenResolve(null);

        const foundMechanic = await mechanicRepository.readMechanic(999);

        expect(foundMechanic).toBeNull();
        verify(mockMechanicRepo.findOne(deepEqual({ where: { mechanic_id: 999 }, relations: ['employee', 'truckRepairs'] }))).once();
    });

    // Test the happy path of updating a mechanic
    it('should update a mechanic', async () => {
        const updateData: Partial<Mechanic> = { specialized_brand: 'Honda' };
        const updatedMechanic = { mechanic_id: 1, specialized_brand: 'Honda', employee: { employee_id: 1 } as Employee, truckRepairs: [] } as Mechanic;
        when(mockMechanicRepo.update(1, deepEqual(updateData))).thenResolve({ affected: 1 } as any);
        when(mockMechanicRepo.findOne(deepEqual({ where: { mechanic_id: 1 }, relations: ['employee', 'truckRepairs'] }))).thenResolve(updatedMechanic);

        const result = await mechanicRepository.updateMechanic(1, updateData);

        expect(result).toEqual(updatedMechanic);
        verify(mockMechanicRepo.update(1, deepEqual(updateData))).once();
        verify(mockMechanicRepo.findOne(deepEqual({ where: { mechanic_id: 1 }, relations: ['employee', 'truckRepairs'] }))).once();
    });

    // Test the edge case where the mechanic ID to update does not exist
    it('should return null when updating a non-existent mechanic', async () => {
        const updateData: Partial<Mechanic> = { specialized_brand: 'Honda' };
        when(mockMechanicRepo.update(999, deepEqual(updateData))).thenResolve({ affected: 0 } as any);

        const result = await mechanicRepository.updateMechanic(999, updateData);

        expect(result).toBeNull();
        verify(mockMechanicRepo.update(999, deepEqual(updateData))).once();
    });

    // Test the happy path of deleting a mechanic
    it('should delete a mechanic', async () => {
        when(mockMechanicRepo.delete(1)).thenResolve({ affected: 1 } as any);

        const result = await mechanicRepository.deleteMechanic(1);

        expect(result).toBe(true);
        verify(mockMechanicRepo.delete(1)).once();
    });

    // Test the edge case where the mechanic ID to delete does not exist
    it('should return false when deleting a non-existent mechanic', async () => {
        when(mockMechanicRepo.delete(999)).thenResolve({ affected: 0 } as any);

        const result = await mechanicRepository.deleteMechanic(999);

        expect(result).toBe(false);
        verify(mockMechanicRepo.delete(999)).once();
    });

    // Test the happy path of reading all mechanics with their employees and truck repairs
    it('should read all mechanics with employees and truck repairs', async () => {
        const mechanics = [
            { mechanic_id: 1, specialized_brand: 'Toyota', employee: { employee_id: 1 } as Employee, truckRepairs: [] },
            { mechanic_id: 2, specialized_brand: 'Ford', employee: { employee_id: 2 } as Employee, truckRepairs: [] },
        ] as Mechanic[];
        when(mockMechanicRepo.find(deepEqual({ relations: ['employee', 'truckRepairs'] }))).thenResolve(mechanics);

        const result = await mechanicRepository.readAllMechanics();

        expect(result).toEqual(mechanics);
        verify(mockMechanicRepo.find(deepEqual({ relations: ['employee', 'truckRepairs'] }))).once();
    });

    // Test the negative case where reading all mechanics fails
    it('should throw an error when reading all mechanics fails', async () => {
        when(mockMechanicRepo.find(deepEqual({ relations: ['employee', 'truckRepairs'] }))).thenThrow(new Error('Database error'));

        await expect(mechanicRepository.readAllMechanics()).rejects.toThrow('Error reading all mechanics');
    });
});
