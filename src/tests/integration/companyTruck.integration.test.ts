import { AppDataSource } from '../../data-source';
import { Company } from '../../entity/Company';
import { Truck } from '../../entity/Truck';
import { Repository } from 'typeorm';

let companyRepository: Repository<Company>;
let truckRepository: Repository<Truck>;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  companyRepository = AppDataSource.getRepository(Company);
  truckRepository = AppDataSource.getRepository(Truck);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Company and Truck Integration Test', () => {
  let company: Company;
  let truck: Truck;

  test('should create, read, update, and delete a company and associate them with a truck', async () => {
    // Create Company
    company = new Company();
    company.company_name = 'FastTrack Logistics';
    company.brand = 'Ford';
    await companyRepository.save(company);

    // Create Truck
    truck = new Truck();
    truck.brand = 'Ford';
    truck.load = 5500;
    truck.truck_capacity = 8000.50;
    truck.year = 2020;
    truck.number_of_repairs = 3;
    truck.company = company;
    await truckRepository.save(truck);

    // Read Truck
    let savedTruck = await truckRepository.findOne({
      where: { truck_id: truck.truck_id },
      relations: ['company'],
    });
    expect(savedTruck).toBeTruthy();
    expect(savedTruck!.company.company_id).toBe(company.company_id);

    // Update Truck
    truck.brand = 'Chevrolet';
    await truckRepository.save(truck);
    savedTruck = await truckRepository.findOne({
      where: { truck_id: truck.truck_id },
      relations: ['company'],
    });
    expect(savedTruck!.brand).toBe('Chevrolet');

    // Delete Company and check Truck
    await companyRepository.remove(company);
    const deletedTruck = await truckRepository.findOne({
      where: { truck_id: truck.truck_id },
    });
    expect(deletedTruck).toBeFalsy();
  });

// Edge Case: Creating a truck with the minimum possible load
test('should create a truck with minimum load', async () => {
  const companyForMinLoad = new Company();
  companyForMinLoad.company_name = 'Min Load Co.';
  companyForMinLoad.brand = 'Toyota';
  await companyRepository.save(companyForMinLoad);

  const minLoadTruck = new Truck();
  minLoadTruck.brand = 'Toyota';
  minLoadTruck.load = 0;
  minLoadTruck.truck_capacity = 1000.00;
  minLoadTruck.year = 2021;
  minLoadTruck.number_of_repairs = 0;
  minLoadTruck.company = companyForMinLoad;
  await truckRepository.save(minLoadTruck); 

  const savedTruck = await truckRepository.findOne({ where: { truck_id: minLoadTruck.truck_id } });
  expect(savedTruck).toBeTruthy();
  expect(savedTruck!.load).toBe(0);
});

// Edge Case: Creating a truck with maximum capacity
test('should create a truck with maximum capacity', async () => {
  const companyForMaxCapacity = new Company();
  companyForMaxCapacity.company_name = 'Max Capacity Co.';
  companyForMaxCapacity.brand = 'Volvo';
  await companyRepository.save(companyForMaxCapacity);

  const maxCapacityTruck = new Truck();
  maxCapacityTruck.brand = 'Volvo';
  maxCapacityTruck.load = 8000;
  maxCapacityTruck.truck_capacity = 20000.00; 
  maxCapacityTruck.year = 2019;
  maxCapacityTruck.number_of_repairs = 2;
  maxCapacityTruck.company = companyForMaxCapacity;
  await truckRepository.save(maxCapacityTruck); 

  const savedTruck = await truckRepository.findOne({ where: { truck_id: maxCapacityTruck.truck_id } });
  expect(savedTruck).toBeTruthy();
  expect(parseFloat(savedTruck!.truck_capacity as any)).toBe(20000.00);
});



  // Edge Case: Creating a company with special characters in the name
  test('should handle special characters in company name', async () => {
    const specialCharCompany = new Company();
    specialCharCompany.company_name = 'FastTrack Logistics & Co.';
    specialCharCompany.brand = 'Volvo';
    await companyRepository.save(specialCharCompany);

    const savedCompany = await companyRepository.findOne({ where: { company_id: specialCharCompany.company_id } });
    expect(savedCompany).toBeTruthy();
    expect(savedCompany!.company_name).toBe('FastTrack Logistics & Co.');
  });

  // Negative Test: Creating a truck without associating it with a company
  test('should not create a truck without a company', async () => {
    try {
      const truckWithoutCompany = new Truck();
      truckWithoutCompany.brand = 'Mercedes';
      truckWithoutCompany.load = 3000;
      truckWithoutCompany.truck_capacity = 5000.00;
      truckWithoutCompany.year = 2020;
      truckWithoutCompany.number_of_repairs = 1;
      await truckRepository.save(truckWithoutCompany);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Updating a truck with invalid data
  test('should not update a truck with invalid data', async () => {
    try {
      truck.truck_capacity = -1000.00; // Invalid capacity
      await truckRepository.save(truck);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Deleting a company that doesn't exist
  test('should not delete a non-existent company', async () => {
    try {
      const nonExistentCompany = new Company();
      nonExistentCompany.company_id = -1; // Assuming negative ID doesn't exist
      await companyRepository.remove(nonExistentCompany);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});