import { Repository, EntityManager } from 'typeorm';
import { Shipment } from '../../entity/Shipment';
import { ShipmentRepository } from '../../repository/ShipmentRepository';
import { Customer } from '../../entity/Customer';
import { TruckTrip } from '../../entity/TruckTrip';
import { instance, mock, when, verify, reset, deepEqual } from 'ts-mockito';

describe('ShipmentRepository Unit Tests', () => {
    let shipmentRepository: ShipmentRepository;
    let mockShipmentRepo: Repository<Shipment>;
    let mockEntityManager: EntityManager;

    // Initialize mock repositories and the ShipmentRepository before each test
    beforeEach(() => {
        mockShipmentRepo = mock<Repository<Shipment>>();
        mockEntityManager = mock<EntityManager>();
        when(mockEntityManager.getRepository(Shipment)).thenReturn(instance(mockShipmentRepo));
        shipmentRepository = new ShipmentRepository(Shipment, instance(mockEntityManager));
    });

    // Reset mocks after each test to ensure isolation
    afterEach(() => {
        reset(mockShipmentRepo);
    });

    // Test the happy path of creating a new shipment
    it('should create a new shipment', async () => {
        const shipmentData: Partial<Shipment> = {
            weight: 1000,
            value: 50000,
            origin: 'New York',
            destination: 'Los Angeles',
            customer: { customer_id: 1 } as Customer,
            truckTrip: { truck_trip_id: 1 } as TruckTrip,
        };
        const savedShipment = { ...shipmentData, shipment_id: 1 } as Shipment;
        when(mockShipmentRepo.save(deepEqual(shipmentData))).thenResolve(savedShipment);

        const newShipment = await shipmentRepository.createShipment(shipmentData as Shipment);

        expect(newShipment).toEqual(savedShipment);
        verify(mockShipmentRepo.save(deepEqual(shipmentData))).once();
    });

    // Test the negative case where creating a shipment fails
    it('should throw an error when creating a shipment fails', async () => {
        const shipmentData: Partial<Shipment> = {
            weight: 1000,
            value: 50000,
            origin: 'New York',
            destination: 'Los Angeles',
            customer: { customer_id: 1 } as Customer,
            truckTrip: { truck_trip_id: 1 } as TruckTrip,
        };
        when(mockShipmentRepo.save(deepEqual(shipmentData))).thenThrow(new Error('Database error'));

        await expect(shipmentRepository.createShipment(shipmentData as Shipment)).rejects.toThrow('Error creating shipment');
    });

    // Test the happy path of reading a shipment by ID with customer and truck trip
    it('should read a shipment by id with customer and truck trip', async () => {
        const shipmentData = {
            shipment_id: 1,
            weight: 1000,
            value: 50000,
            origin: 'New York',
            destination: 'Los Angeles',
            customer: { customer_id: 1 } as Customer,
            truckTrip: { truck_trip_id: 1 } as TruckTrip,
        } as Shipment;
        when(mockShipmentRepo.findOne(deepEqual({ where: { shipment_id: 1 }, relations: ['customer', 'truckTrip'] }))).thenResolve(shipmentData);

        const foundShipment = await shipmentRepository.readShipment(1);

        expect(foundShipment).toEqual(shipmentData);
        verify(mockShipmentRepo.findOne(deepEqual({ where: { shipment_id: 1 }, relations: ['customer', 'truckTrip'] }))).once();
    });

    // Test the edge case where the shipment ID does not exist
    it('should return null when reading a non-existent shipment', async () => {
        when(mockShipmentRepo.findOne(deepEqual({ where: { shipment_id: 999 }, relations: ['customer', 'truckTrip'] }))).thenResolve(null);

        const foundShipment = await shipmentRepository.readShipment(999);

        expect(foundShipment).toBeNull();
        verify(mockShipmentRepo.findOne(deepEqual({ where: { shipment_id: 999 }, relations: ['customer', 'truckTrip'] }))).once();
    });

    // Test the happy path of updating a shipment
    it('should update a shipment', async () => {
        const updateData: Partial<Shipment> = { value: 55000 };
        const updatedShipment = {
            shipment_id: 1,
            weight: 1000,
            value: 55000,
            origin: 'New York',
            destination: 'Los Angeles',
            customer: { customer_id: 1 } as Customer,
            truckTrip: { truck_trip_id: 1 } as TruckTrip,
        } as Shipment;
        when(mockShipmentRepo.update(1, deepEqual(updateData))).thenResolve({ affected: 1 } as any);
        when(mockShipmentRepo.findOne(deepEqual({ where: { shipment_id: 1 }, relations: ['customer', 'truckTrip'] }))).thenResolve(updatedShipment);

        const result = await shipmentRepository.updateShipment(1, updateData);

        expect(result).toEqual(updatedShipment);
        verify(mockShipmentRepo.update(1, deepEqual(updateData))).once();
        verify(mockShipmentRepo.findOne(deepEqual({ where: { shipment_id: 1 }, relations: ['customer', 'truckTrip'] }))).once();
    });

    // Test the edge case where the shipment ID to update does not exist
    it('should return null when updating a non-existent shipment', async () => {
        const updateData: Partial<Shipment> = { value: 55000 };
        when(mockShipmentRepo.update(999, deepEqual(updateData))).thenResolve({ affected: 0 } as any);

        const result = await shipmentRepository.updateShipment(999, updateData);

        expect(result).toBeNull();
        verify(mockShipmentRepo.update(999, deepEqual(updateData))).once();
    });

    // Test the happy path of deleting a shipment
    it('should delete a shipment', async () => {
        when(mockShipmentRepo.delete(1)).thenResolve({ affected: 1 } as any);

        const result = await shipmentRepository.deleteShipment(1);

        expect(result).toBe(true);
        verify(mockShipmentRepo.delete(1)).once();
    });

    // Test the edge case where the shipment ID to delete does not exist
    it('should return false when deleting a non-existent shipment', async () => {
        when(mockShipmentRepo.delete(999)).thenResolve({ affected: 0 } as any);

        const result = await shipmentRepository.deleteShipment(999);

        expect(result).toBe(false);
        verify(mockShipmentRepo.delete(999)).once();
    });

    // Test the happy path of reading all shipments with their customers and truck trips
    it('should read all shipments with customers and truck trips', async () => {
        const shipments = [
            {
                shipment_id: 1,
                weight: 1000,
                value: 50000,
                origin: 'New York',
                destination: 'Los Angeles',
                customer: { customer_id: 1 } as Customer,
                truckTrip: { truck_trip_id: 1 } as TruckTrip,
            },
            {
                shipment_id: 2,
                weight: 2000,
                value: 80000,
                origin: 'Chicago',
                destination: 'Houston',
                customer: { customer_id: 2 } as Customer,
                truckTrip: { truck_trip_id: 2 } as TruckTrip,
            },
        ] as Shipment[];
        when(mockShipmentRepo.find(deepEqual({ relations: ['customer', 'truckTrip'] }))).thenResolve(shipments);

        const result = await shipmentRepository.readAllShipments();

        expect(result).toEqual(shipments);
        verify(mockShipmentRepo.find(deepEqual({ relations: ['customer', 'truckTrip'] }))).once();
    });

    // Test the negative case where reading all shipments fails
    it('should throw an error when reading all shipments fails', async () => {
        when(mockShipmentRepo.find(deepEqual({ relations: ['customer', 'truckTrip'] }))).thenThrow(new Error('Database error'));

        await expect(shipmentRepository.readAllShipments()).rejects.toThrow('Error reading all shipments');
    });
});
