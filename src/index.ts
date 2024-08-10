import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source';
import companyRoutes from './routes/companyRoutes';
import customerRoutes from './routes/customerRoutes';
import driverRoutes from './routes/driverRoutes';
import employeeRoutes from './routes/employeeRoutes';
import mechanicRoutes from './routes/mechanicRoutes';
import shipmentRoutes from './routes/shipmentRoutes';
import truckRoutes from './routes/truckRoutes';
import truckRepairRoutes from './routes/truckRepairRoutes';
import truckTripRoutes from './routes/truckTripRoutes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Final Project - Road Freight Transportation company Working');
});

app.use('/companies', companyRoutes);
app.use('/customers', customerRoutes);
app.use('/drivers', driverRoutes);
app.use('/employees', employeeRoutes);
app.use('/mechanics', mechanicRoutes);
app.use('/shipments', shipmentRoutes);
app.use('/trucks', truckRoutes);
app.use('/truck-repairs', truckRepairRoutes);
app.use('/truck-trips', truckTripRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

export default app;
