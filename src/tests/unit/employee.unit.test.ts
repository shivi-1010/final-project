import { Repository, EntityManager } from 'typeorm';
import { Employee } from '../../entity/Employee';
import { EmployeeRepository } from '../../repository/EmployeeRepository';
import { instance, mock, when, verify, reset, deepEqual } from 'ts-mockito';

describe('EmployeeRepository Unit Tests', () => {
    let employeeRepository: EmployeeRepository;
    let mockEmployeeRepo: Repository<Employee>;
    let mockEntityManager: EntityManager;

    // Initialize mock repositories and the EmployeeRepository before each test
    beforeEach(() => {
        mockEmployeeRepo = mock<Repository<Employee>>();
        mockEntityManager = mock<EntityManager>();
        when(mockEntityManager.getRepository(Employee)).thenReturn(instance(mockEmployeeRepo));
        employeeRepository = new EmployeeRepository(Employee, instance(mockEntityManager));
    });

    // Reset mocks after each test to ensure isolation
    afterEach(() => {
        reset(mockEmployeeRepo);
    });

    // Test the happy path of creating a new employee
    it('should create a new employee', async () => {
        const employeeData: Partial<Employee> = { first_name: 'John', last_name: 'Doe', years_of_service: 5, drivers: [], mechanics: [] };
        const savedEmployee = { ...employeeData, employee_id: 1 } as Employee;
        when(mockEmployeeRepo.save(deepEqual(employeeData))).thenResolve(savedEmployee);

        const newEmployee = await employeeRepository.createEmployee(employeeData as Employee);

        expect(newEmployee).toEqual(savedEmployee);
        verify(mockEmployeeRepo.save(deepEqual(employeeData))).once();
    });

    // Test the negative case where creating an employee fails
    it('should throw an error when creating an employee fails', async () => {
        const employeeData: Partial<Employee> = { first_name: 'John', last_name: 'Doe', years_of_service: 5, drivers: [], mechanics: [] };
        when(mockEmployeeRepo.save(deepEqual(employeeData))).thenThrow(new Error('Database error'));

        await expect(employeeRepository.createEmployee(employeeData as Employee)).rejects.toThrow('Error creating employee');
    });

    // Test the happy path of reading an employee by ID with drivers and mechanics
    it('should read an employee by id with drivers and mechanics', async () => {
        const employeeData = { employee_id: 1, first_name: 'John', last_name: 'Doe', years_of_service: 5, drivers: [], mechanics: [] } as Employee;
        when(mockEmployeeRepo.findOne(deepEqual({ where: { employee_id: 1 }, relations: ['drivers', 'mechanics'] }))).thenResolve(employeeData);

        const foundEmployee = await employeeRepository.readEmployee(1);

        expect(foundEmployee).toEqual(employeeData);
        verify(mockEmployeeRepo.findOne(deepEqual({ where: { employee_id: 1 }, relations: ['drivers', 'mechanics'] }))).once();
    });

    // Test the edge case where the employee ID does not exist
    it('should return null when reading a non-existent employee', async () => {
        when(mockEmployeeRepo.findOne(deepEqual({ where: { employee_id: 999 }, relations: ['drivers', 'mechanics'] }))).thenResolve(null);

        const foundEmployee = await employeeRepository.readEmployee(999);

        expect(foundEmployee).toBeNull();
        verify(mockEmployeeRepo.findOne(deepEqual({ where: { employee_id: 999 }, relations: ['drivers', 'mechanics'] }))).once();
    });

    // Test the happy path of updating an employee
    it('should update an employee', async () => {
        const updateData: Partial<Employee> = { first_name: 'UpdatedName' };
        const updatedEmployee = { employee_id: 1, first_name: 'UpdatedName', last_name: 'Doe', years_of_service: 5, drivers: [], mechanics: [] } as Employee;
        when(mockEmployeeRepo.update(1, deepEqual(updateData))).thenResolve({ affected: 1 } as any);
        when(mockEmployeeRepo.findOne(deepEqual({ where: { employee_id: 1 }, relations: ['drivers', 'mechanics'] }))).thenResolve(updatedEmployee);

        const result = await employeeRepository.updateEmployee(1, updateData);

        expect(result).toEqual(updatedEmployee);
        verify(mockEmployeeRepo.update(1, deepEqual(updateData))).once();
        verify(mockEmployeeRepo.findOne(deepEqual({ where: { employee_id: 1 }, relations: ['drivers', 'mechanics'] }))).once();
    });

    // Test the edge case where the employee ID to update does not exist
    it('should return null when updating a non-existent employee', async () => {
        const updateData: Partial<Employee> = { first_name: 'UpdatedName' };
        when(mockEmployeeRepo.update(999, deepEqual(updateData))).thenResolve({ affected: 0 } as any);

        const result = await employeeRepository.updateEmployee(999, updateData);

        expect(result).toBeNull();
        verify(mockEmployeeRepo.update(999, deepEqual(updateData))).once();
    });

    // Test the happy path of deleting an employee
    it('should delete an employee', async () => {
        when(mockEmployeeRepo.delete(1)).thenResolve({ affected: 1 } as any);

        const result = await employeeRepository.deleteEmployee(1);

        expect(result).toBe(true);
        verify(mockEmployeeRepo.delete(1)).once();
    });

    // Test the edge case where the employee ID to delete does not exist
    it('should return false when deleting a non-existent employee', async () => {
        when(mockEmployeeRepo.delete(999)).thenResolve({ affected: 0 } as any);

        const result = await employeeRepository.deleteEmployee(999);

        expect(result).toBe(false);
        verify(mockEmployeeRepo.delete(999)).once();
    });

    // Test the happy path of reading all employees with their drivers and mechanics
    it('should read all employees with drivers and mechanics', async () => {
        const employees = [
            { employee_id: 1, first_name: 'John', last_name: 'Doe', years_of_service: 5, drivers: [], mechanics: [] },
            { employee_id: 2, first_name: 'Jane', last_name: 'Smith', years_of_service: 3, drivers: [], mechanics: [] },
        ] as Employee[];
        when(mockEmployeeRepo.find(deepEqual({ relations: ['drivers', 'mechanics'] }))).thenResolve(employees);

        const result = await employeeRepository.readAllEmployees();

        expect(result).toEqual(employees);
        verify(mockEmployeeRepo.find(deepEqual({ relations: ['drivers', 'mechanics'] }))).once();
    });

    // Test the negative case where reading all employees fails
    it('should throw an error when reading all employees fails', async () => {
        when(mockEmployeeRepo.find(deepEqual({ relations: ['drivers', 'mechanics'] }))).thenThrow(new Error('Database error'));

        await expect(employeeRepository.readAllEmployees()).rejects.toThrow('Error reading all employees');
    });
});
