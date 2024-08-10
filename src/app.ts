import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import companyRoutes from './routes/companyRoutes';
import customerRoutes from './routes/customerRoutes';
import driverRoutes from './routes/driverRoutes';
import employeeRoutes from './routes/employeeRoutes';
import mechanicRoutes from './routes/mechanicRoutes';
import shipmentRoutes from './routes/shipmentRoutes';
import truckRoutes from './routes/truckRoutes';
import truckRepairRoutes from './routes/truckRepairRoutes';
import truckTripRoutes from './routes/truckTripRoutes';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/companies', companyRoutes);
app.use('/customers', customerRoutes);
app.use('/drivers', driverRoutes);
app.use('/employees', employeeRoutes);
app.use('/mechanics', mechanicRoutes);
app.use('/shipments', shipmentRoutes);
app.use('/trucks', truckRoutes);
app.use('/truckRepairs', truckRepairRoutes);
app.use('/truckTrips', truckTripRoutes);

export default app;
