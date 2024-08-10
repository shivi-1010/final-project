import { Repository, EntityTarget, EntityManager } from 'typeorm';
import { Employee } from '../entity/Employee';

export class EmployeeRepository {
    private employeeRepo: Repository<Employee>;

    constructor(entity: EntityTarget<Employee>, manager: EntityManager) {
        this.employeeRepo = manager.getRepository(entity);
    }

    async createEmployee(employee: Employee): Promise<Employee> {
        try {
            return await this.employeeRepo.save(employee);
        } catch (error) {
            throw new Error('Error creating employee');
        }
    }

    async readEmployee(employee_id: number): Promise<Employee | null> {
        try {
            return await this.employeeRepo.findOne({
                where: { employee_id },
                relations: ['drivers', 'mechanics'],
            });
        } catch (error) {
            throw new Error('Error reading employee');
        }
    }

    async updateEmployee(employee_id: number, updateData: Partial<Employee>): Promise<Employee | null> {
        try {
            const result = await this.employeeRepo.update(employee_id, updateData);
            console.log('Update result:', result);
            if (result.affected === 0) return null;

            const updatedEmployee = await this.employeeRepo.findOne({
                where: { employee_id },
                relations: ['drivers', 'mechanics'],
            });
            console.log('Updated Employee from DB:', updatedEmployee);
            return updatedEmployee;
        } catch (error) {
            throw new Error('Error updating employee');
        }
    }

    async deleteEmployee(employee_id: number): Promise<boolean> {
        try {
            const result = await this.employeeRepo.delete(employee_id);
            return result.affected !== 0;
        } catch (error) {
            throw new Error('Error deleting employee');
        }
    }

    async readAllEmployees(): Promise<Employee[]> {
        try {
            return await this.employeeRepo.find({ relations: ['drivers', 'mechanics'] });
        } catch (error) {
            throw new Error('Error reading all employees');
        }
    }
}
