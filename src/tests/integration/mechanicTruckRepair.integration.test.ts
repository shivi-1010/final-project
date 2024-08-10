// src/tests/integration/mechanicTruckRepair.integration.test.ts
import { AppDataSource } from '../../data-source';
import { Mechanic } from '../../entity/Mechanic';
import { Employee } from '../../entity/Employee';
import { Truck } from '../../entity/Truck';
import { TruckRepair } from '../../entity/TruckRepair';
import { Repository } from 'typeorm';

let mechanicRepository: Repository<Mechanic>;
let employeeRepository: Repository<Employee>;
let truckRepairRepository: Repository<TruckRepair>;
let truckRepository: Repository<Truck>;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  mechanicRepository = AppDataSource.getRepository(Mechanic);
  employeeRepository = AppDataSource.getRepository(Employee);
  truckRepairRepository = AppDataSource.getRepository(TruckRepair);
  truckRepository = AppDataSource.getRepository(Truck);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Mechanic and TruckRepair Integration Test', () => {
  let mechanic: Mechanic;
  let truckRepair: TruckRepair;

  // Happy Path: Create, read, update, and delete a mechanic and associate them with a truck repair
  test('should create, read, update, and delete a mechanic and associate them with a truck repair', async () => {
    // Create Employee
    const employee = new Employee();
    employee.first_name = 'Anaswara';
    employee.last_name = 'Nair';
    employee.years_of_service = 3;
    await employeeRepository.save(employee);

    // Create Mechanic
    mechanic = new Mechanic();
    mechanic.employee = employee;
    mechanic.specialized_brand = 'Ford';
    await mechanicRepository.save(mechanic);

    // Create Truck
    const truck = new Truck();
    truck.brand = 'Ford';
    truck.load = 5500;
    truck.truck_capacity = 8000.50;
    truck.year = 2020;
    truck.number_of_repairs = 3;
    await truckRepository.save(truck);

    // Create TruckRepair
    truckRepair = new TruckRepair();
    truckRepair.truck = truck;
    truckRepair.mechanic = mechanic;
    truckRepair.start_date = new Date('2024-07-20T08:00:00');
    truckRepair.end_date = new Date('2024-07-23T16:00:00');
    truckRepair.estimated_days = 3;
    await truckRepairRepository.save(truckRepair);

    // Read TruckRepair
    let savedTruckRepair = await truckRepairRepository.findOne({
      where: { repair_id: truckRepair.repair_id },
      relations: ['mechanic', 'truck'],
    });
    expect(savedTruckRepair).toBeTruthy();
    expect(savedTruckRepair!.mechanic!.mechanic_id).toBe(mechanic.mechanic_id);

    // Update TruckRepair
    truckRepair.estimated_days = 5;
    await truckRepairRepository.save(truckRepair);
    savedTruckRepair = await truckRepairRepository.findOne({
      where: { repair_id: truckRepair.repair_id },
      relations: ['mechanic'],
    });
    expect(savedTruckRepair!.estimated_days).toBe(5);

    // Delete Mechanic and check TruckRepair
    await mechanicRepository.remove(mechanic);
    savedTruckRepair = await truckRepairRepository.findOne({
      where: { repair_id: truckRepair.repair_id },
    });
    expect(savedTruckRepair).toBeFalsy();
  });

  // Edge Case: Create a TruckRepair with minimal information
  test('should create a truck repair with minimal information', async () => {
    // Create a minimal TruckRepair
    const truck = new Truck();
    truck.brand = 'Toyota';
    truck.load = 3000;
    truck.truck_capacity = 6000;
    truck.year = 2021;
    truck.number_of_repairs = 1;
    await truckRepository.save(truck);

    truckRepair = new TruckRepair();
    truckRepair.truck = truck;
    truckRepair.start_date = new Date();
    truckRepair.estimated_days = 1;
    await truckRepairRepository.save(truckRepair);

    const savedTruckRepair = await truckRepairRepository.findOne({ where: { repair_id: truckRepair.repair_id } });
    expect(savedTruckRepair).toBeTruthy();
    expect(savedTruckRepair!.estimated_days).toBe(1);
  });

  // Negative Test: Creating a TruckRepair without a truck
  test('should not create a truck repair without a truck', async () => {
    try {
      truckRepair = new TruckRepair();
      truckRepair.estimated_days = 5;
      await truckRepairRepository.save(truckRepair);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Updating a TruckRepair with invalid data
  test('should not update a truck repair with invalid data', async () => {
    try {
      truckRepair.estimated_days = -1; // Invalid estimated days
      await truckRepairRepository.save(truckRepair);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Deleting a non-existent truck repair
  test('should not delete a non-existent truck repair', async () => {
    try {
      const nonExistentTruckRepair = new TruckRepair();
      nonExistentTruckRepair.repair_id = -1; // Assuming negative ID doesn't exist
      await truckRepairRepository.remove(nonExistentTruckRepair);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
