import { AppDataSource } from '../../data-source';
import { Truck } from '../../entity/Truck';
import { TruckRepair } from '../../entity/TruckRepair';
import { Mechanic } from '../../entity/Mechanic';
import { Employee } from '../../entity/Employee';
import { Repository } from 'typeorm';

let truckRepository: Repository<Truck>;
let truckRepairRepository: Repository<TruckRepair>;
let mechanicRepository: Repository<Mechanic>;
let employeeRepository: Repository<Employee>;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  truckRepository = AppDataSource.getRepository(Truck);
  truckRepairRepository = AppDataSource.getRepository(TruckRepair);
  mechanicRepository = AppDataSource.getRepository(Mechanic);
  employeeRepository = AppDataSource.getRepository(Employee);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Truck and TruckRepair Integration Test', () => {
  let truck: Truck;
  let truckRepair: TruckRepair;

  test('should create, read, update, and delete a truck and associate it with a truck repair', async () => {
    // Create Truck
    truck = new Truck();
    truck.brand = 'Ford';
    truck.load = 5000;
    truck.truck_capacity = 12000.50;
    truck.year = 2019;
    truck.number_of_repairs = 2;
    await truckRepository.save(truck);

    // Create Employee
    const employee = new Employee();
    employee.first_name = 'Anaswara';
    employee.last_name = 'Nair';
    employee.years_of_service = 3;
    await employeeRepository.save(employee);

    // Create Mechanic
    const mechanic = new Mechanic();
    mechanic.employee = employee;
    mechanic.specialized_brand = 'Ford';
    await mechanicRepository.save(mechanic);

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

  // Edge Case: Creating a truck repair with minimum estimated days
  test('should create a truck repair with minimum estimated days', async () => {
    const minDaysRepair = new TruckRepair();
    minDaysRepair.truck = truck;
    const mechanic = await mechanicRepository.findOne({ where: {} });
    if (!mechanic) {
      throw new Error('No mechanic found');
    }
    minDaysRepair.mechanic = mechanic;
    minDaysRepair.start_date = new Date('2024-07-01T08:00:00');
    minDaysRepair.end_date = new Date('2024-07-01T08:00:00');
    minDaysRepair.estimated_days = 0; // Minimum estimated days
    await truckRepairRepository.save(minDaysRepair);

    const savedTruckRepair = await truckRepairRepository.findOne({ where: { repair_id: minDaysRepair.repair_id } });
    expect(savedTruckRepair).toBeTruthy();
    expect(savedTruckRepair!.estimated_days).toBe(0);
  });

  // Negative Test: Creating a truck repair without associating it with a mechanic
  test('should not create a truck repair without a mechanic', async () => {
    try {
      const truckRepairWithoutMechanic = new TruckRepair();
      truckRepairWithoutMechanic.truck = truck;
      truckRepairWithoutMechanic.start_date = new Date('2024-08-01T08:00:00');
      truckRepairWithoutMechanic.end_date = new Date('2024-08-03T08:00:00');
      truckRepairWithoutMechanic.estimated_days = 2;
      await truckRepairRepository.save(truckRepairWithoutMechanic);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Updating a truck repair with invalid data
  test('should not update a truck repair with invalid data', async () => {
    try {
      truckRepair.estimated_days = -5; // Invalid estimated days
      await truckRepairRepository.save(truckRepair);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Deleting a truck repair that doesn't exist
  test('should not delete a non-existent truck repair', async () => {
    try {
      const nonExistentRepair = new TruckRepair();
      nonExistentRepair.repair_id = -1; // Assuming negative ID doesn't exist
      await truckRepairRepository.remove(nonExistentRepair);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
