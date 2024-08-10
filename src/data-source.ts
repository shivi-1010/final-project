
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Company } from './entity/Company';
import { Driver } from './entity/Driver';
import { Employee } from './entity/Employee';
import { Mechanic } from './entity/Mechanic';
import { Customer } from './entity/Customer';
import { Shipment } from './entity/Shipment';
import { Truck } from './entity/Truck';
import { TruckRepair } from './entity/TruckRepair';
import { TruckTrip } from './entity/TruckTrip';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'postgres',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'testdatabase',
    synchronize: false, // Set to false in production to avoid accidental schema changes
    logging: true, // Set to false to disable query logging
    entities: [Company, Driver, Employee, Mechanic, Customer, Shipment, Truck, TruckRepair, TruckTrip],
    migrations: ['dist/migration/**/*.js'], // Path to migration files
    subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });