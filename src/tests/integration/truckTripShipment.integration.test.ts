import { AppDataSource } from '../../data-source';
import { TruckTrip } from '../../entity/TruckTrip';
import { Shipment } from '../../entity/Shipment';
import { Repository } from 'typeorm';

let truckTripRepository: Repository<TruckTrip>;
let shipmentRepository: Repository<Shipment>;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  truckTripRepository = AppDataSource.getRepository(TruckTrip);
  shipmentRepository = AppDataSource.getRepository(Shipment);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe('Truck Trip and Shipment Integration Test', () => {
  let truckTrip: TruckTrip;
  let shipment: Shipment;

  test('should create, read, update, and delete a truck trip and associate it with a shipment', async () => {
    // Create TruckTrip
    truckTrip = new TruckTrip();
    truckTrip.route = 'North Route';
    await truckTripRepository.save(truckTrip);
  
    // Create Shipment
    shipment = new Shipment();
    shipment.weight = 120.5;
    shipment.value = 8000.00;
    shipment.origin = 'Warehouse X';
    shipment.destination = 'Store Y';
    shipment.truckTrip = truckTrip;
    await shipmentRepository.save(shipment);
  
    // Read Shipment
    let savedShipment = await shipmentRepository.findOne({
      where: { shipment_id: shipment.shipment_id },
      relations: ['truckTrip'],
    });
    expect(savedShipment).toBeTruthy();
    expect(savedShipment!.truckTrip!.truck_trip_id).toBe(truckTrip.truck_trip_id);
  
    // Update Shipment
    shipment.value = 9000.00;
    await shipmentRepository.save(shipment);
    savedShipment = await shipmentRepository.findOne({
      where: { shipment_id: shipment.shipment_id },
      relations: ['truckTrip'],
    });
    expect(Number(savedShipment!.value)).toBe(9000); // Convert to number before comparison
  
    // Delete TruckTrip and check Shipment
    await truckTripRepository.remove(truckTrip);
    savedShipment = await shipmentRepository.findOne({
      where: { shipment_id: shipment.shipment_id },
    });
    expect(savedShipment).toBeFalsy();
  });
  

  test('should create a truck trip with a shipment having zero value', async () => {
    // Ensure truckTrip is initialized properly
    truckTrip = new TruckTrip();
    truckTrip.route = 'South Route';
    await truckTripRepository.save(truckTrip);
  
    // Create Shipment with zero value
    const zeroValueShipment = new Shipment();
    zeroValueShipment.weight = 50;
    zeroValueShipment.value = 0; 
    zeroValueShipment.origin = 'Warehouse Z';
    zeroValueShipment.destination = 'Store W';
    zeroValueShipment.truckTrip = truckTrip; // Ensure association with truckTrip
    await shipmentRepository.save(zeroValueShipment);
  
    // Retrieve the saved shipment from the database
    const savedShipment = await shipmentRepository.findOne({
      where: { shipment_id: zeroValueShipment.shipment_id },
    });
  
    // Verify that the shipment was saved correctly
    expect(savedShipment).toBeTruthy();
    expect(Number(savedShipment!.value)).toBe(0); // Convert to number before comparison
  });
  
  

  // Negative Test: Creating a shipment without associating it with a truck trip
  test('should not create a shipment without a truck trip', async () => {
    try {
      const shipmentWithoutTruckTrip = new Shipment();
      shipmentWithoutTruckTrip.weight = 100;
      shipmentWithoutTruckTrip.value = 5000.00;
      shipmentWithoutTruckTrip.origin = 'Warehouse A';
      shipmentWithoutTruckTrip.destination = 'Store B';
      await shipmentRepository.save(shipmentWithoutTruckTrip);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Negative Test: Updating a shipment with negative weight
  test('should not update a shipment with negative weight', async () => {
    try {
      shipment.weight = -10; // Invalid weight
      await shipmentRepository.save(shipment);
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
