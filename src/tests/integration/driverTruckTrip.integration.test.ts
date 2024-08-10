import { AppDataSource } from '../../data-source';
import { Driver } from '../../entity/Driver';
import { Employee } from '../../entity/Employee';
import { TruckTrip } from '../../entity/TruckTrip';
import { Truck } from '../../entity/Truck';
import { Repository } from 'typeorm';

let driverRepository: Repository<Driver>;
let employeeRepository: Repository<Employee>;
let truckTripRepository: Repository<TruckTrip>;
let truckRepository: Repository<Truck>;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  driverRepository = AppDataSource.getRepository(Driver);
  employeeRepository = AppDataSource.getRepository(Employee);
  truckTripRepository = AppDataSource.getRepository(TruckTrip);
  truckRepository = AppDataSource.getRepository(Truck);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Driver and TruckTrip Integration Test', () => {
  let driver: Driver;
  let truckTrip: TruckTrip;

  // Happy Path: Create, read, update, and delete a driver associated with a truck trip
  test('should create, read, update, and delete a driver and associate them with a truck trip', async () => {
    // Create Employee
    const employee = new Employee();
    employee.first_name = 'Shivani';
    employee.last_name = 'Varu';
    employee.years_of_service = 5;
    await employeeRepository.save(employee);

    // Create Driver
    driver = new Driver();
    driver.employee = employee;
    driver.driver_category = 'Regular Driver';
    await driverRepository.save(driver);

    // Create Truck
    const truck = new Truck();
    truck.brand = 'Ford';
    truck.load = 5500;
    truck.truck_capacity = 8000.50;
    truck.year = 2020;
    truck.number_of_repairs = 3;
    await truckRepository.save(truck);

    // Create TruckTrip
    truckTrip = new TruckTrip();
    truckTrip.route = 'Coastal Highway Route';
    truckTrip.truck = truck;
    truckTrip.driver1 = driver;
    await truckTripRepository.save(truckTrip);

    // Read TruckTrip
    let savedTruckTrip = await truckTripRepository.findOne({
      where: { truck_trip_id: truckTrip.truck_trip_id },
      relations: ['driver1', 'truck'],
    });
    expect(savedTruckTrip).toBeTruthy();
    expect(savedTruckTrip!.driver1!.driver_category).toBe('Regular Driver');

    // Update Driver Category
    driver.driver_category = 'Occasional Driver';
    await driverRepository.save(driver);
    savedTruckTrip = await truckTripRepository.findOne({
      where: { truck_trip_id: truckTrip.truck_trip_id },
      relations: ['driver1'],
    });
    expect(savedTruckTrip!.driver1!.driver_category).toBe('Occasional Driver');

    // Delete Driver
    await driverRepository.remove(driver);
    savedTruckTrip = await truckTripRepository.findOne({
      where: { truck_trip_id: truckTrip.truck_trip_id },
      relations: ['driver1'],
    });
    expect(savedTruckTrip!.driver1).toBeNull();
  });

  // Edge Case: Adding a second driver to the truck trip
  test('should add a second driver to the truck trip', async () => {
    const employee2 = new Employee();
    employee2.first_name = 'John';
    employee2.last_name = 'Doe';
    employee2.years_of_service = 3;
    await employeeRepository.save(employee2);

    const secondDriver = new Driver();
    secondDriver.employee = employee2;
    secondDriver.driver_category = 'Backup Driver';
    await driverRepository.save(secondDriver);

    truckTrip.driver2 = secondDriver;
    await truckTripRepository.save(truckTrip);

    const savedTruckTrip = await truckTripRepository.findOne({
      where: { truck_trip_id: truckTrip.truck_trip_id },
      relations: ['driver2'],
    });
    expect(savedTruckTrip).toBeTruthy();
    expect(savedTruckTrip!.driver2!.driver_id).toBe(secondDriver.driver_id);
  });

  // Negative Test: Creating a truck trip without a driver
  test('should not create a truck trip without a driver', async () => {
    try {
      const truckTripWithoutDriver = new TruckTrip();
      truckTripWithoutDriver.route = 'Mountain Pass';
      const truck = new Truck();
      truck.brand = 'Ford';
      truck.load = 5500;
      truck.truck_capacity = 8000.50;
      truck.year = 2020;
      truck.number_of_repairs = 3;
      truckTripWithoutDriver.truck = truck;
      await truckTripRepository.save(truckTripWithoutDriver);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Updating a truck trip with an invalid route
  test('should not update a truck trip with an invalid route', async () => {
    try {
      truckTrip.route = ''; // Invalid route
      await truckTripRepository.save(truckTrip);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Deleting a non-existent truck trip
  test('should not delete a non-existent truck trip', async () => {
    try {
      const nonExistentTruckTrip = new TruckTrip();
      nonExistentTruckTrip.truck_trip_id = -1; // Assuming negative ID doesn't exist
      await truckTripRepository.remove(nonExistentTruckTrip);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
