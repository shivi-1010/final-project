import { AppDataSource } from '../../data-source';
import { Driver } from '../../entity/Driver';
import { Employee } from '../../entity/Employee';
import { Repository } from 'typeorm';

let driverRepository: Repository<Driver>;
let employeeRepository: Repository<Employee>;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  driverRepository = AppDataSource.getRepository(Driver);
  employeeRepository = AppDataSource.getRepository(Employee);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Driver and Employee Integration Test', () => {
  let employee: Employee;
  let driver: Driver;

  // Happy Path: Create, read, update, and delete a driver associated with an employee
  test('should create, read, update, and delete a driver associated with an employee', async () => {
    // Create Employee
    employee = new Employee();
    employee.first_name = 'Kevin';
    employee.last_name = 'Martin';
    employee.years_of_service = 25;
    await employeeRepository.save(employee);

    // Create Driver
    driver = new Driver();
    driver.employee = employee;
    driver.driver_category = 'Regular Driver';
    await driverRepository.save(driver);

    // Read Driver
    let savedDriver = await driverRepository.findOne({
      where: { driver_id: driver.driver_id },
      relations: ['employee'],
    });
    expect(savedDriver).toBeTruthy();
    expect(savedDriver!.employee.employee_id).toBe(employee.employee_id);

    // Update Driver
    driver.driver_category = 'Occasional Driver';
    await driverRepository.save(driver);
    savedDriver = await driverRepository.findOne({
      where: { driver_id: driver.driver_id },
      relations: ['employee'],
    });
    expect(savedDriver!.driver_category).toBe('Occasional Driver');

    // Delete Employee and check Driver
    await employeeRepository.remove(employee);
    const deletedDriver = await driverRepository.findOne({
      where: { driver_id: driver.driver_id },
    });
    expect(deletedDriver).toBeFalsy();
  });

  // Edge Case: Creating a driver with minimal information
  test('should create a driver with minimal information', async () => {
    const minimalEmployee = new Employee();
    minimalEmployee.first_name = 'John';
    minimalEmployee.last_name = 'Doe';
    minimalEmployee.years_of_service = 0;
    await employeeRepository.save(minimalEmployee);

    const minimalDriver = new Driver();
    minimalDriver.employee = minimalEmployee;
    minimalDriver.driver_category = 'Temporary';
    await driverRepository.save(minimalDriver);

    const savedDriver = await driverRepository.findOne({ where: { driver_id: minimalDriver.driver_id } });
    expect(savedDriver).toBeTruthy();
    expect(savedDriver!.driver_category).toBe('Temporary');
  });

  // Negative Test: Creating a driver without associating it with an employee
  test('should not create a driver without an associated employee', async () => {
    try {
      const invalidDriver = new Driver();
      invalidDriver.driver_category = 'Invalid Driver';
      await driverRepository.save(invalidDriver);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Updating a driver with invalid data
  test('should not update a driver with invalid data', async () => {
    try {
      driver.driver_category = ''; // Invalid data
      await driverRepository.save(driver);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Deleting a non-existent employee
  test('should not delete a non-existent employee', async () => {
    try {
      const nonExistentEmployee = new Employee();
      nonExistentEmployee.employee_id = -1; // Assuming negative ID doesn't exist
      await employeeRepository.remove(nonExistentEmployee);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
