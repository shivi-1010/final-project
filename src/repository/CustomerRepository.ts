import { Repository, EntityTarget, EntityManager } from 'typeorm';
import { Customer } from '../entity/Customer';

export class CustomerRepository {
    private customerRepo: Repository<Customer>;

    constructor(entity: EntityTarget<Customer>, manager: EntityManager) {
        this.customerRepo = manager.getRepository(entity);
    }

    async createCustomer(customer: Customer): Promise<Customer> {
        try {
            return await this.customerRepo.save(customer);
        } catch (error) {
            throw new Error('Error creating customer');
        }
    }

    async readCustomer(customer_id: number): Promise<Customer | null> {
        try {
            return await this.customerRepo.findOne({
                where: { customer_id },
                relations: ['shipments'],
            });
        } catch (error) {
            throw new Error('Error reading customer');
        }
    }

    async updateCustomer(customer_id: number, updateData: Partial<Customer>): Promise<Customer | null> {
        try {
            const result = await this.customerRepo.update(customer_id, updateData);
            if (result.affected === 0) return null;
            return await this.customerRepo.findOne({
                where: { customer_id },
                relations: ['shipments'],
            });
        } catch (error) {
            throw new Error('Error updating customer');
        }
    }

    async deleteCustomer(customer_id: number): Promise<boolean> {
        try {
            const result = await this.customerRepo.delete(customer_id);
            return result.affected !== 0;
        } catch (error) {
            throw new Error('Error deleting customer');
        }
    }

    async readAllCustomers(): Promise<Customer[]> {
        try {
            return await this.customerRepo.find({ relations: ['shipments'] });
        } catch (error) {
            throw new Error('Error reading all customers');
        }
    }

    async readCustomersByName(customer_name: string): Promise<Customer[]> {
        try {
            return await this.customerRepo.find({
                where: { customer_name },
                relations: ['shipments'],
            });
        } catch (error) {
            throw new Error('Error reading customers by name');
        }
    }

    async readCustomersByAddress(customer_address: string): Promise<Customer[]> {
        try {
            return await this.customerRepo.find({
                where: { customer_address },
                relations: ['shipments'],
            });
        } catch (error) {
            throw new Error('Error reading customers by address');
        }
    }

    async readCustomersByPhone1(customer_phone1: string): Promise<Customer[]> {
        try {
            return await this.customerRepo.find({
                where: { customer_phone1 },
                relations: ['shipments'],
            });
        } catch (error) {
            throw new Error('Error reading customers by phone1');
        }
    }

    async readCustomersByPhone2(customer_phone2: string): Promise<Customer[]> {
        try {
            return await this.customerRepo.find({
                where: { customer_phone2 },
                relations: ['shipments'],
            });
        } catch (error) {
            throw new Error('Error reading customers by phone2');
        }
    }
}
