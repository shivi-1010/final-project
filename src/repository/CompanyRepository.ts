import { Repository, EntityTarget, EntityManager } from 'typeorm';
import { Company } from '../entity/Company';

export class CompanyRepository {
    private companyRepo: Repository<Company>;

    constructor(entity: EntityTarget<Company>, manager: EntityManager) {
        this.companyRepo = manager.getRepository(entity);
    }

    async createCompany(company: Company): Promise<Company> {
        try {
            return await this.companyRepo.save(company);
        } catch (error) {
            throw new Error('Error creating company');
        }
    }

    async readCompany(company_id: number): Promise<Company | null> {
        try {
            return await this.companyRepo.findOne({
                where: { company_id },
                relations: ['trucks'],
            });
        } catch (error) {
            throw new Error('Error reading company');
        }
    }

    async updateCompany(company_id: number, updateData: Partial<Company>): Promise<Company | null> {
        try {
            const result = await this.companyRepo.update(company_id, updateData);
            if (result.affected === 0) return null;
            return await this.companyRepo.findOne({
                where: { company_id },
                relations: ['trucks'],
            });
        } catch (error) {
            throw new Error('Error updating company');
        }
    }

    async deleteCompany(company_id: number): Promise<boolean> {
        try {
            const result = await this.companyRepo.delete(company_id);
            return result.affected !== 0;
        } catch (error) {
            throw new Error('Error deleting company');
        }
    }

    async readAllCompanies(): Promise<Company[]> {
        try {
            return await this.companyRepo.find({ relations: ['trucks'] });
        } catch (error) {
            throw new Error('Error reading all companies');
        }
    }
}
