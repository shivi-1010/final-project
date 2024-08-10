import { Repository, EntityManager } from 'typeorm';
import { Company } from '../../entity/Company';
import { CompanyRepository } from '../../repository/CompanyRepository';
import { instance, mock, when, verify, reset, deepEqual } from 'ts-mockito';

describe('CompanyRepository Unit Tests', () => {
    let companyRepository: CompanyRepository;
    let mockCompanyRepo: Repository<Company>;
    let mockEntityManager: EntityManager;

    // Initialize mock repositories and the CompanyRepository before each test
    beforeEach(() => {
        mockCompanyRepo = mock<Repository<Company>>();
        mockEntityManager = mock<EntityManager>();
        when(mockEntityManager.getRepository(Company)).thenReturn(instance(mockCompanyRepo));
        companyRepository = new CompanyRepository(Company, instance(mockEntityManager));
    });

    // Reset mocks after each test to ensure isolation
    afterEach(() => {
        reset(mockCompanyRepo);
    });

    // Test the happy path of creating a new company
    it('should create a new company', async () => {
        const companyData: Partial<Company> = { company_name: 'Test Company', brand: 'Test Brand', trucks: [] };
        const savedCompany = { ...companyData, company_id: 1 } as Company;
        when(mockCompanyRepo.save(deepEqual(companyData))).thenResolve(savedCompany);

        const newCompany = await companyRepository.createCompany(companyData as Company);

        expect(newCompany).toEqual(savedCompany);
        verify(mockCompanyRepo.save(deepEqual(companyData))).once();
    });

    // Test the negative case where creating a company fails
    it('should throw an error when creating a company fails', async () => {
        const companyData: Partial<Company> = { company_name: 'Test Company', brand: 'Test Brand', trucks: [] };
        when(mockCompanyRepo.save(deepEqual(companyData))).thenThrow(new Error('Database error'));

        await expect(companyRepository.createCompany(companyData as Company)).rejects.toThrow('Error creating company');
    });

    // Test the happy path of reading a company by ID with trucks
    it('should read a company by id with trucks', async () => {
        const companyData = { company_id: 1, company_name: 'Test Company', trucks: [], brand: '' } as Company;
        when(mockCompanyRepo.findOne(deepEqual({ where: { company_id: 1 }, relations: ['trucks'] }))).thenResolve(companyData);

        const foundCompany = await companyRepository.readCompany(1);

        expect(foundCompany).toEqual(companyData);
        verify(mockCompanyRepo.findOne(deepEqual({ where: { company_id: 1 }, relations: ['trucks'] }))).once();
    });

    // Test the edge case where the company ID does not exist
    it('should return null when reading a non-existent company', async () => {
        when(mockCompanyRepo.findOne(deepEqual({ where: { company_id: 999 }, relations: ['trucks'] }))).thenResolve(null);

        const foundCompany = await companyRepository.readCompany(999);

        expect(foundCompany).toBeNull();
        verify(mockCompanyRepo.findOne(deepEqual({ where: { company_id: 999 }, relations: ['trucks'] }))).once();
    });

    // Test the happy path of updating a company
    it('should update a company', async () => {
        const updateData: Partial<Company> = { company_name: 'Updated Company' };
        const updatedCompany = { company_id: 1, company_name: 'Updated Company', trucks: [], brand: '' } as Company;
        when(mockCompanyRepo.update(1, deepEqual(updateData))).thenResolve({ affected: 1 } as any);
        when(mockCompanyRepo.findOne(deepEqual({ where: { company_id: 1 }, relations: ['trucks'] }))).thenResolve(updatedCompany);

        const result = await companyRepository.updateCompany(1, updateData);

        expect(result).toEqual(updatedCompany);
        verify(mockCompanyRepo.update(1, deepEqual(updateData))).once();
        verify(mockCompanyRepo.findOne(deepEqual({ where: { company_id: 1 }, relations: ['trucks'] }))).once();
    });

    // Test the edge case where the company ID to update does not exist
    it('should return null when updating a non-existent company', async () => {
        const updateData: Partial<Company> = { company_name: 'Updated Company' };
        when(mockCompanyRepo.update(999, deepEqual(updateData))).thenResolve({ affected: 0 } as any);

        const result = await companyRepository.updateCompany(999, updateData);

        expect(result).toBeNull();
        verify(mockCompanyRepo.update(999, deepEqual(updateData))).once();
    });

    // Test the happy path of deleting a company
    it('should delete a company', async () => {
        when(mockCompanyRepo.delete(1)).thenResolve({ affected: 1 } as any);

        const result = await companyRepository.deleteCompany(1);

        expect(result).toBe(true);
        verify(mockCompanyRepo.delete(1)).once();
    });

    // Test the edge case where the company ID to delete does not exist
    it('should return false when deleting a non-existent company', async () => {
        when(mockCompanyRepo.delete(999)).thenResolve({ affected: 0 } as any);

        const result = await companyRepository.deleteCompany(999);

        expect(result).toBe(false);
        verify(mockCompanyRepo.delete(999)).once();
    });

    // Test the happy path of reading all companies with their trucks
    it('should read all companies with trucks', async () => {
        const companies = [
            { company_id: 1, company_name: 'Company 1', trucks: [], brand: '' },
            { company_id: 2, company_name: 'Company 2', trucks: [], brand: '' },
        ] as Company[];
        when(mockCompanyRepo.find(deepEqual({ relations: ['trucks'] }))).thenResolve(companies);

        const result = await companyRepository.readAllCompanies();

        expect(result).toEqual(companies);
        verify(mockCompanyRepo.find(deepEqual({ relations: ['trucks'] }))).once();
    });

    // Test the negative case where reading all companies fails
    it('should throw an error when reading all companies fails', async () => {
        when(mockCompanyRepo.find(deepEqual({ relations: ['trucks'] }))).thenThrow(new Error('Database error'));

        await expect(companyRepository.readAllCompanies()).rejects.toThrow('Error reading all companies');
    });
});