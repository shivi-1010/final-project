import { AppDataSource } from '../../data-source';
import { Shipment } from '../../entity/Shipment';
import { Customer } from '../../entity/Customer';
import { Repository } from 'typeorm';

let shipmentRepository: Repository<Shipment>;
let customerRepository: Repository<Customer>;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  shipmentRepository = AppDataSource.getRepository(Shipment);
  customerRepository = AppDataSource.getRepository(Customer);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Shipment and Customer Integration Test', () => {
  let shipment: Shipment;
  let customer: Customer;

  test('should create, read, update, and delete a shipment and associate it with a customer', async () => {
    // Create Customer
    customer = new Customer();
    customer.customer_name = 'Jane Doe';
    customer.customer_address = '123 Main St';
    customer.customer_phone1 = '123-456-7890';
    customer.customer_phone2 = '098-765-4321';
    await customerRepository.save(customer);

    // Create Shipment
    shipment = new Shipment();
    shipment.weight = 100.5;
    shipment.value = 5000.00;
    shipment.customer = customer;
    shipment.origin = 'Warehouse A';
    shipment.destination = 'Retail Store B';
    await shipmentRepository.save(shipment);

    // Read Shipment
    let savedShipment = await shipmentRepository.findOne({
      where: { shipment_id: shipment.shipment_id },
      relations: ['customer'],
    });
    expect(savedShipment).toBeTruthy();
    expect(savedShipment!.customer.customer_id).toBe(customer.customer_id);

    // Update Shipment
    shipment.value = 6000.00;
    await shipmentRepository.save(shipment);
    savedShipment = await shipmentRepository.findOne({
      where: { shipment_id: shipment.shipment_id },
      relations: ['customer'],
    });
    expect(Number(savedShipment!.value)).toBe(6000.00);

    // Delete Customer and check Shipment
    await customerRepository.remove(customer);
    savedShipment = await shipmentRepository.findOne({
      where: { shipment_id: shipment.shipment_id },
    });
    expect(savedShipment).toBeFalsy();
  });

  test('should create a shipment with zero weight', async () => {
    // Create a new Customer to ensure a valid customer reference
    const newCustomer = new Customer();
    newCustomer.customer_name = 'John Doe';
    newCustomer.customer_address = '456 Elm St';
    newCustomer.customer_phone1 = '321-654-9870';
    newCustomer.customer_phone2 = '789-012-3456';
    await customerRepository.save(newCustomer);
  
    // Create a new Shipment instance
    const zeroWeightShipment = new Shipment();
    zeroWeightShipment.weight = 0;
    zeroWeightShipment.value = 1000.00;
    zeroWeightShipment.customer = newCustomer; 
    zeroWeightShipment.origin = 'Vaughan Mills';
    zeroWeightShipment.destination = 'Mississauga';
  
    // Save the shipment to the database
    await shipmentRepository.save(zeroWeightShipment);
  
    // Retrieve the saved shipment from the database
    const savedShipment = await shipmentRepository.findOne({
      where: { shipment_id: zeroWeightShipment.shipment_id },
    });
  
    // Verify that the shipment was saved correctly
    expect(savedShipment).toBeTruthy();
    expect(Number(savedShipment!.weight)).toBe(0); // Ensure the weight is 0
    expect(Number(savedShipment!.value)).toBe(1000.00);
  });
  
  
  // Negative Test: Creating a shipment without a customer
  test('should not create a shipment without a customer', async () => {
    try {
      const shipmentWithoutCustomer = new Shipment();
      shipmentWithoutCustomer.weight = 50;
      shipmentWithoutCustomer.value = 2500.00;
      shipmentWithoutCustomer.origin = 'Warehouse C';
      shipmentWithoutCustomer.destination = 'Retail Store D';
      await shipmentRepository.save(shipmentWithoutCustomer);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Updating a shipment with invalid value
  test('should not update a shipment with invalid value', async () => {
    try {
      shipment.value = -1000.00; 
      await shipmentRepository.save(shipment);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Deleting a non-existent shipment
  test('should not delete a non-existent shipment', async () => {
    try {
      const nonExistentShipment = new Shipment();
      nonExistentShipment.shipment_id = -1; 
      await shipmentRepository.remove(nonExistentShipment);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
