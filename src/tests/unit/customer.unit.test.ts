import { Repository, EntityManager } from 'typeorm';
import { Customer } from '../../entity/Customer';
import { CustomerRepository } from '../../repository/CustomerRepository';
import { instance, mock, when, verify, reset, deepEqual } from 'ts-mockito';

describe('CustomerRepository Unit Tests', () => {
    let customerRepository: CustomerRepository;
    let mockCustomerRepo: Repository<Customer>;
    let mockEntityManager: EntityManager;

    // Initialize mock repositories and the CustomerRepository before each test
    beforeEach(() => {
        mockCustomerRepo = mock<Repository<Customer>>();
        mockEntityManager = mock<EntityManager>();
        when(mockEntityManager.getRepository(Customer)).thenReturn(instance(mockCustomerRepo));
        customerRepository = new CustomerRepository(Customer, instance(mockEntityManager));
    });

    // Reset mocks after each test to ensure isolation
    afterEach(() => {
        reset(mockCustomerRepo);
    });

    // Test the happy path of creating a new customer
    it('should create a new customer', async () => {
        const customerData: Partial<Customer> = {
            customer_name: 'Test Customer',
            customer_address: '123 Test St',
            customer_phone1: '123-456-7890',
            customer_phone2: '098-765-4321',
            shipments: [],
        };
        const savedCustomer = { ...customerData, customer_id: 1 } as Customer;
        when(mockCustomerRepo.save(deepEqual(customerData))).thenResolve(savedCustomer);

        const newCustomer = await customerRepository.createCustomer(customerData as Customer);

        expect(newCustomer).toEqual(savedCustomer);
        verify(mockCustomerRepo.save(deepEqual(customerData))).once();
    });

    // Test the negative case where creating a customer fails
    it('should throw an error when creating a customer fails', async () => {
        const customerData: Partial<Customer> = {
            customer_name: 'Test Customer',
            customer_address: '123 Test St',
            customer_phone1: '123-456-7890',
            customer_phone2: '098-765-4321',
            shipments: [],
        };
        when(mockCustomerRepo.save(deepEqual(customerData))).thenThrow(new Error('Database error'));

        await expect(customerRepository.createCustomer(customerData as Customer)).rejects.toThrow('Error creating customer');
    });

    // Test the happy path of reading a customer by ID with shipments
    it('should read a customer by id with shipments', async () => {
        const customerData = {
            customer_id: 1,
            customer_name: 'Test Customer',
            customer_address: '123 Test St',
            customer_phone1: '123-456-7890',
            customer_phone2: '098-765-4321',
            shipments: [],
        } as Customer;
        when(mockCustomerRepo.findOne(deepEqual({ where: { customer_id: 1 }, relations: ['shipments'] }))).thenResolve(customerData);

        const foundCustomer = await customerRepository.readCustomer(1);

        expect(foundCustomer).toEqual(customerData);
        verify(mockCustomerRepo.findOne(deepEqual({ where: { customer_id: 1 }, relations: ['shipments'] }))).once();
    });

    // Test the edge case where the customer ID does not exist
    it('should return null when reading a non-existent customer', async () => {
        when(mockCustomerRepo.findOne(deepEqual({ where: { customer_id: 999 }, relations: ['shipments'] }))).thenResolve(null);

        const foundCustomer = await customerRepository.readCustomer(999);

        expect(foundCustomer).toBeNull();
        verify(mockCustomerRepo.findOne(deepEqual({ where: { customer_id: 999 }, relations: ['shipments'] }))).once();
    });

    // Test the happy path of updating a customer
    it('should update a customer', async () => {
        const updateData: Partial<Customer> = { customer_name: 'Updated Customer' };
        const updatedCustomer = {
            customer_id: 1,
            customer_name: 'Updated Customer',
            customer_address: '123 Test St',
            customer_phone1: '123-456-7890',
            customer_phone2: '098-765-4321',
            shipments: [],
        } as Customer;
        when(mockCustomerRepo.update(1, deepEqual(updateData))).thenResolve({ affected: 1 } as any);
        when(mockCustomerRepo.findOne(deepEqual({ where: { customer_id: 1 }, relations: ['shipments'] }))).thenResolve(updatedCustomer);

        const result = await customerRepository.updateCustomer(1, updateData);

        expect(result).toEqual(updatedCustomer);
        verify(mockCustomerRepo.update(1, deepEqual(updateData))).once();
        verify(mockCustomerRepo.findOne(deepEqual({ where: { customer_id: 1 }, relations: ['shipments'] }))).once();
    });

    // Test the edge case where the customer ID to update does not exist
    it('should return null when updating a non-existent customer', async () => {
        const updateData: Partial<Customer> = { customer_name: 'Updated Customer' };
        when(mockCustomerRepo.update(999, deepEqual(updateData))).thenResolve({ affected: 0 } as any);

        const result = await customerRepository.updateCustomer(999, updateData);

        expect(result).toBeNull();
        verify(mockCustomerRepo.update(999, deepEqual(updateData))).once();
    });

    // Test the happy path of deleting a customer
    it('should delete a customer', async () => {
        when(mockCustomerRepo.delete(1)).thenResolve({ affected: 1 } as any);

        const result = await customerRepository.deleteCustomer(1);

        expect(result).toBe(true);
        verify(mockCustomerRepo.delete(1)).once();
    });

    // Test the edge case where the customer ID to delete does not exist
    it('should return false when deleting a non-existent customer', async () => {
        when(mockCustomerRepo.delete(999)).thenResolve({ affected: 0 } as any);

        const result = await customerRepository.deleteCustomer(999);

        expect(result).toBe(false);
        verify(mockCustomerRepo.delete(999)).once();
    });

    // Test the happy path of reading all customers with their shipments
    it('should read all customers with shipments', async () => {
        const customers = [
            {
                customer_id: 1,
                customer_name: 'Customer 1',
                customer_address: '123 Test St',
                customer_phone1: '123-456-7890',
                customer_phone2: '098-765-4321',
                shipments: [],
            },
            {
                customer_id: 2,
                customer_name: 'Customer 2',
                customer_address: '456 Another St',
                customer_phone1: '987-654-3210',
                customer_phone2: '012-345-6789',
                shipments: [],
            },
        ] as Customer[];
        when(mockCustomerRepo.find(deepEqual({ relations: ['shipments'] }))).thenResolve(customers);

        const result = await customerRepository.readAllCustomers();

        expect(result).toEqual(customers);
        verify(mockCustomerRepo.find(deepEqual({ relations: ['shipments'] }))).once();
    });

    // Test the negative case where reading all customers fails
    it('should throw an error when reading all customers fails', async () => {
        when(mockCustomerRepo.find(deepEqual({ relations: ['shipments'] }))).thenThrow(new Error('Database error'));

        await expect(customerRepository.readAllCustomers()).rejects.toThrow('Error reading all customers');
    });

    // Test the happy path of reading customers by name
    it('should read customers by name', async () => {
        const customers = [
            {
                customer_id: 1,
                customer_name: 'Test Customer',
                customer_address: '123 Test St',
                customer_phone1: '123-456-7890',
                customer_phone2: '098-765-4321',
                shipments: [],
            },
        ] as Customer[];
        when(mockCustomerRepo.find(deepEqual({ where: { customer_name: 'Test Customer' }, relations: ['shipments'] }))).thenResolve(customers);

        const result = await customerRepository.readCustomersByName('Test Customer');

        expect(result).toEqual(customers);
        verify(mockCustomerRepo.find(deepEqual({ where: { customer_name: 'Test Customer' }, relations: ['shipments'] }))).once();
    });

    // Test the happy path of reading customers by address
    it('should read customers by address', async () => {
        const customers = [
            {
                customer_id: 1,
                customer_name: 'Test Customer',
                customer_address: '123 Test St',
                customer_phone1: '123-456-7890',
                customer_phone2: '098-765-4321',
                shipments: [],
            },
        ] as Customer[];
        when(mockCustomerRepo.find(deepEqual({ where: { customer_address: '123 Test St' }, relations: ['shipments'] }))).thenResolve(customers);

        const result = await customerRepository.readCustomersByAddress('123 Test St');

        expect(result).toEqual(customers);
        verify(mockCustomerRepo.find(deepEqual({ where: { customer_address: '123 Test St' }, relations: ['shipments'] }))).once();
    });

    // Test the happy path of reading customers by phone1
    it('should read customers by phone1', async () => {
        const customers = [
            {
                customer_id: 1,
                customer_name: 'Test Customer',
                customer_address: '123 Test St',
                customer_phone1: '123-456-7890',
                customer_phone2: '098-765-4321',
                shipments: [],
            },
        ] as Customer[];
        when(mockCustomerRepo.find(deepEqual({ where: { customer_phone1: '123-456-7890' }, relations: ['shipments'] }))).thenResolve(customers);

        const result = await customerRepository.readCustomersByPhone1('123-456-7890');

        expect(result).toEqual(customers);
        verify(mockCustomerRepo.find(deepEqual({ where: { customer_phone1: '123-456-7890' }, relations: ['shipments'] }))).once();
    });

    // Test the happy path of reading customers by phone2
    it('should read customers by phone2', async () => {
        const customers = [
            {
                customer_id: 1,
                customer_name: 'Test Customer',
                customer_address: '123 Test St',
                customer_phone1: '123-456-7890',
                customer_phone2: '098-765-4321',
                shipments: [],
            },
        ] as Customer[];
        when(mockCustomerRepo.find(deepEqual({ where: { customer_phone2: '098-765-4321' }, relations: ['shipments'] }))).thenResolve(customers);

        const result = await customerRepository.readCustomersByPhone2('098-765-4321');

        expect(result).toEqual(customers);
        verify(mockCustomerRepo.find(deepEqual({ where: { customer_phone2: '098-765-4321' }, relations: ['shipments'] }))).once();
    });
});
