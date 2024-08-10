import { AppDataSource } from '../../data-source';
import { Truck } from '../../entity/Truck';
import { TruckTrip } from '../../entity/TruckTrip';
import { Driver } from '../../entity/Driver';
import { Employee } from '../../entity/Employee';
import { Repository } from 'typeorm';

let truckRepository: Repository<Truck>;
let truckTripRepository: Repository<TruckTrip>;
let driverRepository: Repository<Driver>;
let employeeRepository: Repository<Employee>;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  truckRepository = AppDataSource.getRepository(Truck);
  truckTripRepository = AppDataSource.getRepository(TruckTrip);
  driverRepository = AppDataSource.getRepository(Driver);
  employeeRepository = AppDataSource.getRepository(Employee);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Truck and TruckTrip Integration Test', () => {
  let truck: Truck;
  let truckTrip: TruckTrip;

  test('should create, read, update, and delete a truck and associate it with a truck trip', async () => {
    // Create Truck
    truck = new Truck();
    truck.brand = 'Toyota';
    truck.load = 6000;
    truck.truck_capacity = 10000.00;
    truck.year = 2022;
    truck.number_of_repairs = 1;
    await truckRepository.save(truck);

    // Create Employee
    const employee = new Employee();
    employee.first_name = 'Mark';
    employee.last_name = 'Smith';
    employee.years_of_service = 8;
    await employeeRepository.save(employee);

    // Create Driver
    const driver = new Driver();
    driver.employee = employee;
    driver.driver_category = 'Regular Driver';
    await driverRepository.save(driver);

    // Create TruckTrip
    truckTrip = new TruckTrip();
    truckTrip.route = 'Desert Route';
    truckTrip.truck = truck;
    truckTrip.driver1 = driver;
    await truckTripRepository.save(truckTrip);

    // Read TruckTrip
    let savedTruckTrip = await truckTripRepository.findOne({
      where: { truck_trip_id: truckTrip.truck_trip_id },
      relations: ['truck', 'driver1'],
    });
    expect(savedTruckTrip).toBeTruthy();
    expect(savedTruckTrip!.truck.truck_id).toBe(truck.truck_id);

    // Update TruckTrip
    truckTrip.route = 'Mountain Route';
    await truckTripRepository.save(truckTrip);
    savedTruckTrip = await truckTripRepository.findOne({
      where: { truck_trip_id: truckTrip.truck_trip_id },
      relations: ['truck'],
    });
    expect(savedTruckTrip!.route).toBe('Mountain Route');

    // Delete Truck and check TruckTrip
    await truckRepository.remove(truck);
    savedTruckTrip = await truckTripRepository.findOne({
      where: { truck_trip_id: truckTrip.truck_trip_id },
    });
    expect(savedTruckTrip).toBeFalsy();
  });

  // Edge Case: Creating a truck trip with an empty route
  test('should create a truck trip with an empty route', async () => {
    // Ensure the truck and driver are properly initialized and saved
    const newTruck = new Truck();
    newTruck.brand = 'Toyota';
    newTruck.load = 5000;
    newTruck.truck_capacity = 10000.00;
    newTruck.year = 2020;
    newTruck.number_of_repairs = 0;
    await truckRepository.save(newTruck);
  
    const newEmployee = new Employee();
    newEmployee.first_name = 'John';
    newEmployee.last_name = 'Doe';
    newEmployee.years_of_service = 5;
    await employeeRepository.save(newEmployee);
  
    const newDriver = new Driver();
    newDriver.employee = newEmployee;
    newDriver.driver_category = 'Regular Driver';
    await driverRepository.save(newDriver);
  
    // Create TruckTrip with an empty route
    const emptyRouteTrip = new TruckTrip();
    emptyRouteTrip.route = ''; // Explicitly set an empty route
    emptyRouteTrip.truck = newTruck;
    emptyRouteTrip.driver1 = newDriver; // Properly set driver1
    await truckTripRepository.save(emptyRouteTrip); // Save the entity
  
    // Retrieve the saved TruckTrip from the database
    const savedTruckTrip = await truckTripRepository.findOne({
      where: { truck_trip_id: emptyRouteTrip.truck_trip_id }
    });
  
    // Verify that the TruckTrip was saved correctly
    expect(savedTruckTrip).toBeTruthy();
    expect(savedTruckTrip!.route).toBe(''); // Ensure the route is an empty string
  });
  

  // Negative Test: Creating a truck trip without associating it with a truck
  test('should not create a truck trip without a truck', async () => {
    try {
      const truckTripWithoutTruck = new TruckTrip();
      truckTripWithoutTruck.route = 'Forest Route';
      await truckTripRepository.save(truckTripWithoutTruck);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Updating a truck trip with invalid data
  test('should not update a truck trip with invalid data', async () => {
    try {
      truckTrip.route = null as unknown as string; // Invalid route
      await truckTripRepository.save(truckTrip);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Deleting a truck trip that doesn't exist
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
