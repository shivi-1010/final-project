import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Employee } from '../entity/Employee';

const router = Router();

// Helper function to handle unknown errors
function handleError(res: any, error: unknown) {
    if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
}

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await AppDataSource.getRepository(Employee).find({ relations: ['drivers', 'mechanics'] });
        res.json(employees);
    } catch (error) {
        handleError(res, error);
    }
});

// Get a single employee by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employeeId = parseInt(id);
        if (isNaN(employeeId) || employeeId <= 0) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const employee = await AppDataSource.getRepository(Employee).findOne({ where: { employee_id: employeeId }, relations: ['drivers', 'mechanics'] });
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Get employees by first name
router.get('/first_name/:first_name', async (req, res) => {
    try {
        const { first_name } = req.params;

        const employees = await AppDataSource.getRepository(Employee).find({ where: { first_name }, relations: ['drivers', 'mechanics'] });
        if (employees.length > 0) {
            res.json(employees);
        } else {
            res.status(404).json({ message: 'No employees found with the given first name' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Get employees by last name
router.get('/last_name/:last_name', async (req, res) => {
    try {
        const { last_name } = req.params;

        const employees = await AppDataSource.getRepository(Employee).find({ where: { last_name }, relations: ['drivers', 'mechanics'] });
        if (employees.length > 0) {
            res.json(employees);
        } else {
            res.status(404).json({ message: 'No employees found with the given last name' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Get employees by years of service
router.get('/years_of_service/:years_of_service', async (req, res) => {
    try {
        const { years_of_service } = req.params;
        const yearsOfService = parseInt(years_of_service);
        if (isNaN(yearsOfService) || yearsOfService < 0) {
            return res.status(400).json({ message: 'Invalid years of service' });
        }

        const employees = await AppDataSource.getRepository(Employee).find({ where: { years_of_service: yearsOfService }, relations: ['drivers', 'mechanics'] });
        if (employees.length > 0) {
            res.json(employees);
        } else {
            res.status(404).json({ message: 'No employees found with the given years of service' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Create a new employee
router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, years_of_service } = req.body;

        const employee = new Employee();
        employee.first_name = first_name;
        employee.last_name = last_name;
        employee.years_of_service = years_of_service;

        const result = await AppDataSource.getRepository(Employee).save(employee);
        res.status(201).json(result);
    } catch (error) {
        handleError(res, error);
    }
});

// Update an employee by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employeeId = parseInt(id);
        if (isNaN(employeeId) || employeeId <= 0) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const { first_name, last_name, years_of_service } = req.body;
        const employee = await AppDataSource.getRepository(Employee).findOne({ where: { employee_id: employeeId }, relations: ['drivers', 'mechanics'] });

        if (employee) {
            employee.first_name = first_name;
            employee.last_name = last_name;
            employee.years_of_service = years_of_service;
            const result = await AppDataSource.getRepository(Employee).save(employee);
            res.json(result);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Delete an employee by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employeeId = parseInt(id);
        if (isNaN(employeeId) || employeeId <= 0) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const result = await AppDataSource.getRepository(Employee).delete(employeeId);
        if (result.affected) {
            res.json({ message: 'Employee deleted' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Delete employees by first name
router.delete('/first_name/:first_name', async (req, res) => {
    try {
        const { first_name } = req.params;

        const result = await AppDataSource.getRepository(Employee).delete({ first_name });
        if (result.affected) {
            res.json({ message: 'Employees deleted' });
        } else {
            res.status(404).json({ message: 'No employees found with the given first name' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Delete employees by last name
router.delete('/last_name/:last_name', async (req, res) => {
    try {
        const { last_name } = req.params;

        const result = await AppDataSource.getRepository(Employee).delete({ last_name });
        if (result.affected) {
            res.json({ message: 'Employees deleted' });
        } else {
            res.status(404).json({ message: 'No employees found with the given last name' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Delete employees by years of service
router.delete('/years_of_service/:years_of_service', async (req, res) => {
    try {
        const { years_of_service } = req.params;
        const yearsOfService = parseInt(years_of_service);
        if (isNaN(yearsOfService) || yearsOfService < 0) {
            return res.status(400).json({ message: 'Invalid years of service' });
        }

        const result = await AppDataSource.getRepository(Employee).delete({ years_of_service: yearsOfService });
        if (result.affected) {
            res.json({ message: 'Employees deleted' });
        } else {
            res.status(404).json({ message: 'No employees found with the given years of service' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

export default router;
