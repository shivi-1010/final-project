import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Customer } from '../entity/Customer';

const router = Router();

// Helper function to handle unknown errors
function handleError(res: Response, error: unknown) {
    if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
}

// Get all customers
router.get('/', async (req: Request, res: Response) => {
    try {
        const customers = await AppDataSource.getRepository(Customer).find({ relations: ['shipments'] });
        res.json(customers);
    } catch (error) {
        handleError(res, error);
    }
});

// Get a single customer by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.id);
        if (isNaN(customerId) || customerId <= 0) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const customer = await AppDataSource.getRepository(Customer).findOne({ where: { customer_id: customerId }, relations: ['shipments'] });
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Get customers by name
router.get('/name/:customer_name', async (req: Request, res: Response) => {
    try {
        const { customer_name } = req.params;
        const customers = await AppDataSource.getRepository(Customer).find({ where: { customer_name }, relations: ['shipments'] });
        res.json(customers);
    } catch (error) {
        handleError(res, error);
    }
});

// Get customers by address
router.get('/address/:customer_address', async (req: Request, res: Response) => {
    try {
        const { customer_address } = req.params;
        const customers = await AppDataSource.getRepository(Customer).find({ where: { customer_address }, relations: ['shipments'] });
        res.json(customers);
    } catch (error) {
        handleError(res, error);
    }
});

// Get customers by phone1
router.get('/phone1/:customer_phone1', async (req: Request, res: Response) => {
    try {
        const { customer_phone1 } = req.params;
        const customers = await AppDataSource.getRepository(Customer).find({ where: { customer_phone1 }, relations: ['shipments'] });
        res.json(customers);
    } catch (error) {
        handleError(res, error);
    }
});

// Get customers by phone2
router.get('/phone2/:customer_phone2', async (req: Request, res: Response) => {
    try {
        const { customer_phone2 } = req.params;
        const customers = await AppDataSource.getRepository(Customer).find({ where: { customer_phone2 }, relations: ['shipments'] });
        res.json(customers);
    } catch (error) {
        handleError(res, error);
    }
});

// Create a new customer
router.post('/', async (req: Request, res: Response) => {
    try {
        const customerRepository = AppDataSource.getRepository(Customer);
        const newCustomer = customerRepository.create(req.body);
        const savedCustomer = await customerRepository.save(newCustomer);
        res.status(201).json(savedCustomer);
    } catch (error) {
        handleError(res, error);
    }
});

// Update a customer by ID

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.id);
        if (isNaN(customerId) || customerId <= 0) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const customerRepository = AppDataSource.getRepository(Customer);
        const customer = await customerRepository.findOne({ where: { customer_id: customerId }, relations: ['shipments'] });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        await customerRepository.update(customerId, req.body);
        const updatedCustomer = await customerRepository.findOne({ where: { customer_id: customerId }, relations: ['shipments'] });
        res.json(updatedCustomer);
    } catch (error) {
        handleError(res, error);
    }
});
// Delete a customer by ID
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const customerId = parseInt(req.params.id);
        if (isNaN(customerId) || customerId <= 0) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const customerRepository = AppDataSource.getRepository(Customer);
        const customer = await customerRepository.findOne({ where: { customer_id: customerId }, relations: ['shipments'] });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        await customerRepository.delete(customerId);
        res.status(204).send();
    } catch (error) {
        handleError(res, error);
    }
});

// Delete customers by name
router.delete('/name/:customer_name', async (req: Request, res: Response) => {
    try {
        const { customer_name } = req.params;
        const result = await AppDataSource.getRepository(Customer).delete({ customer_name });
        if (result.affected) {
            res.json({ message: 'Customers deleted' });
        } else {
            res.status(404).json({ message: 'No customers found with the given name' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Delete customers by address
router.delete('/address/:customer_address', async (req: Request, res: Response) => {
    try {
        const { customer_address } = req.params;
        const result = await AppDataSource.getRepository(Customer).delete({ customer_address });
        if (result.affected) {
            res.json({ message: 'Customers deleted' });
        } else {
            res.status(404).json({ message: 'No customers found with the given address' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Delete customers by phone1
router.delete('/phone1/:customer_phone1', async (req: Request, res: Response) => {
    try {
        const { customer_phone1 } = req.params;
        const result = await AppDataSource.getRepository(Customer).delete({ customer_phone1 });
        if (result.affected) {
            res.json({ message: 'Customers deleted' });
        } else {
            res.status(404).json({ message: 'No customers found with the given phone1' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

// Delete customers by phone2
router.delete('/phone2/:customer_phone2', async (req: Request, res: Response) => {
    try {
        const { customer_phone2 } = req.params;
        const result = await AppDataSource.getRepository(Customer).delete({ customer_phone2 });
        if (result.affected) {
            res.json({ message: 'Customers deleted' });
        } else {
            res.status(404).json({ message: 'No customers found with the given phone2' });
        }
    } catch (error) {
        handleError(res, error);
    }
});

export default router;
