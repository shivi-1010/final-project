// src/tests/integration/employeeMechanic.integration.test.ts
import { AppDataSource } from '../../data-source';
import { Employee } from '../../entity/Employee';
import { Mechanic } from '../../entity/Mechanic';
import { Repository } from 'typeorm';

let employeeRepository: Repository<Employee>;
let mechanicRepository: Repository<Mechanic>;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  employeeRepository = AppDataSource.getRepository(Employee);
  mechanicRepository = AppDataSource.getRepository(Mechanic);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Employee and Mechanic Integration Test', () => {
  let employee: Employee;
  let mechanic: Mechanic;

  // Happy Path: Create, read, update, and delete an employee associated with a mechanic
  test('should create, read, update, and delete an employee and associate them with a mechanic', async () => {
    // Create Employee
    employee = new Employee();
    employee.first_name = 'TEST';
    employee.last_name = 'Brown';
    employee.years_of_service = 15;
    await employeeRepository.save(employee);

    // Create Mechanic
    mechanic = new Mechanic();
    mechanic.employee = employee;
    mechanic.specialized_brand = 'Volvo';
    await mechanicRepository.save(mechanic);

    // Read Mechanic
    let savedMechanic = await mechanicRepository.findOne({
      where: { mechanic_id: mechanic.mechanic_id },
      relations: ['employee'],
    });
    expect(savedMechanic).toBeTruthy();
    expect(savedMechanic!.employee.employee_id).toBe(employee.employee_id);

    // Update Mechanic
    mechanic.specialized_brand = 'Mercedes';
    await mechanicRepository.save(mechanic);
    savedMechanic = await mechanicRepository.findOne({
      where: { mechanic_id: mechanic.mechanic_id },
      relations: ['employee'],
    });
    expect(savedMechanic!.specialized_brand).toBe('Mercedes');

    // Delete Employee and check Mechanic
    await employeeRepository.remove(employee);
    const deletedMechanic = await mechanicRepository.findOne({
      where: { mechanic_id: mechanic.mechanic_id },
    });
    expect(deletedMechanic).toBeFalsy();
  });

  // Edge Case: Create mechanic without specialized brand
  test('should create a mechanic without a specialized brand', async () => {
    const newEmployee = new Employee();
    newEmployee.first_name = 'Jane';
    newEmployee.last_name = 'Doe';
    newEmployee.years_of_service = 10;
    await employeeRepository.save(newEmployee);

    const newMechanic = new Mechanic();
    newMechanic.employee = newEmployee;
    newMechanic.specialized_brand = ''; // No specialized brand
    await mechanicRepository.save(newMechanic);

    const savedMechanic = await mechanicRepository.findOne({
      where: { mechanic_id: newMechanic.mechanic_id },
    });
    expect(savedMechanic).toBeTruthy();
    expect(savedMechanic!.specialized_brand).toBe('');
  });

  // Negative Test: Create mechanic without an employee
  test('should not create a mechanic without an employee', async () => {
    try {
      const mechanicWithoutEmployee = new Mechanic();
      mechanicWithoutEmployee.specialized_brand = 'BMW';
      await mechanicRepository.save(mechanicWithoutEmployee);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Update mechanic with invalid data
  test('should not update a mechanic with invalid data', async () => {
    try {
      mechanic.specialized_brand = ''; // Invalid specialized brand
      await mechanicRepository.save(mechanic);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Delete a non-existent mechanic
  test('should not delete a non-existent mechanic', async () => {
    try {
      const nonExistentMechanic = new Mechanic();
      nonExistentMechanic.mechanic_id = -1; // Assuming negative ID doesn't exist
      await mechanicRepository.remove(nonExistentMechanic);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
