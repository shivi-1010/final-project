import { Router } from 'express';
import { Company } from '../entity/Company';
import { AppDataSource } from '../data-source';
import { Truck } from '../entity/Truck';

const router = Router();

// Get all companies
router.get('/', async (req, res) => {
    try {
        const companies: Company[] = await AppDataSource.getRepository(Company).find({ relations: ["trucks"] });
        res.json(companies);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single company by ID
router.get('/id/:company_id', async (req, res) => {
    try {
        const { company_id } = req.params;
        const company = await AppDataSource.getRepository(Company).findOne({
            where: { company_id: parseInt(company_id) },
            relations: ["trucks"]
        });
        if (company) {
            res.json(company);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get companies by company_name
router.get('/name/:company_name', async (req, res) => {
    try {
        const { company_name } = req.params;
        const companies: Company[] = await AppDataSource.getRepository(Company).find({
            where: { company_name },
            relations: ["trucks"]
        });
        if (companies.length > 0) {
            res.json(companies);
        } else {
            res.status(404).json({ message: 'No companies found with this name' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get companies by brand
router.get('/brand/:brand', async (req, res) => {
    try {
        const { brand } = req.params;
        const companies: Company[] = await AppDataSource.getRepository(Company).find({
            where: { brand },
            relations: ["trucks"]
        });
        if (companies.length > 0) {
            res.json(companies);
        } else {
            res.status(404).json({ message: 'No companies found with this brand' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new company
router.post('/', async (req, res) => {
    try {
        const { company_name, brand, trucks } = req.body;
        console.log('Request body:', req.body);

        const company = AppDataSource.getRepository(Company).create({
            company_name,
            brand
        });

        if (trucks && trucks.length > 0) {
            company.trucks = trucks.map((truck: any) => {
                console.log('Truck data received:', truck);
                return AppDataSource.getRepository(Truck).create({
                    brand: truck.brand,
                    load: truck.load,
                    truck_capacity: truck.truck_capacity,
                    year: truck.year,
                    number_of_repairs: truck.number_of_repairs
                });
            });
        }

        const result = await AppDataSource.getRepository(Company).save(company);
        console.log('Company created with result:', result);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Update a company by ID
router.put('/id/:company_id', async (req, res) => {
    try {
        const { company_id } = req.params;
        const { company_name, brand, trucks } = req.body;
        console.log('Request body:', req.body);

        const company = await AppDataSource.getRepository(Company).findOne({ where: { company_id: parseInt(company_id) }, relations: ["trucks"] });

        if (company) {
            company.company_name = company_name ?? company.company_name;
            company.brand = brand ?? company.brand;
            if (trucks && trucks.length > 0) {
                const truckRepo = AppDataSource.getRepository(Truck);
                company.trucks = trucks.map((truck: any) => {
                    console.log('Truck data received:', truck);
                    return truckRepo.create({
                        brand: truck.brand,
                        load: truck.load,
                        truck_capacity: truck.truck_capacity,
                        year: truck.year,
                        number_of_repairs: truck.number_of_repairs
                    });
                });
                await truckRepo.save(company.trucks);
            }
            const result = await AppDataSource.getRepository(Company).save(company);
            console.log('Company updated with result:', result);
            res.json(result);
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Delete a company by ID
router.delete('/id/:company_id', async (req, res) => {
    try {
        const { company_id } = req.params;
        const result = await AppDataSource.getRepository(Company).delete(company_id);
        if (result.affected) {
            res.json({ message: 'Company deleted' });
        } else {
            res.status(404).json({ message: 'Company not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Delete companies by company_name
router.delete('/name/:company_name', async (req, res) => {
    try {
        const { company_name } = req.params;
        const result = await AppDataSource.getRepository(Company).delete({ company_name });
        if (result.affected) {
            res.json({ message: 'Companies deleted' });
        } else {
            res.status(404).json({ message: 'No companies found with this name' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Delete companies by brand
router.delete('/brand/:brand', async (req, res) => {
    try {
        const { brand } = req.params;
        const result = await AppDataSource.getRepository(Company).delete({ brand });
        if (result.affected) {
            res.json({ message: 'Companies deleted' });
        } else {
            res.status(404).json({ message: 'No companies found with this brand' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router;
