import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchema1634567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
-- Drop existing tables if they exist
DROP TABLE IF EXISTS truck_repairs CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS truck_trips CASCADE;
DROP TABLE IF EXISTS mechanics CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS trucks CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Create companies table
CREATE TABLE companies (
  company_id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL
);

-- Create trucks table
CREATE TABLE trucks (
  truck_id SERIAL PRIMARY KEY,
  brand VARCHAR(255) NOT NULL,
  load INTEGER NOT NULL DEFAULT 0,
  truck_capacity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  year INTEGER NOT NULL,
  number_of_repairs INTEGER NOT NULL DEFAULT 0,
  company_id INTEGER REFERENCES companies(company_id) ON DELETE CASCADE
);

-- Create employees table
CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  years_of_service INTEGER NOT NULL
);

-- Create drivers table
CREATE TABLE drivers (
  driver_id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(employee_id) ON DELETE CASCADE,
  driver_category VARCHAR(255) NOT NULL
);

-- Create mechanics table
CREATE TABLE mechanics (
  mechanic_id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(employee_id) ON DELETE CASCADE,
  specialized_brand VARCHAR(255) NOT NULL DEFAULT 'Unknown'
);

-- Create customers table
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_address VARCHAR(255) NOT NULL,
  customer_phone1 VARCHAR(15) NOT NULL,
  customer_phone2 VARCHAR(15) NOT NULL
);

-- Create truck_trips table
CREATE TABLE truck_trips (
  truck_trip_id SERIAL PRIMARY KEY,
  route VARCHAR(255) NOT NULL,
  truck_id INTEGER REFERENCES trucks(truck_id) ON DELETE CASCADE,
  driver1_id INTEGER REFERENCES drivers(driver_id) ON DELETE SET NULL,
  driver2_id INTEGER REFERENCES drivers(driver_id) ON DELETE SET NULL
);

-- Create shipments table
CREATE TABLE shipments (
  shipment_id SERIAL PRIMARY KEY,
  weight DECIMAL(10, 2) NOT NULL DEFAULT 0,
  value DECIMAL(10, 2) NOT NULL,
  customer_id INTEGER REFERENCES customers(customer_id) ON DELETE CASCADE,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  truck_trip_id INTEGER REFERENCES truck_trips(truck_trip_id) ON DELETE CASCADE
);

-- Create truck_repairs table
CREATE TABLE truck_repairs (
  repair_id SERIAL PRIMARY KEY,
  truck_id INTEGER REFERENCES trucks(truck_id) ON DELETE CASCADE,
  mechanic_id INTEGER REFERENCES mechanics(mechanic_id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL DEFAULT now(),
  end_date TIMESTAMP NOT NULL DEFAULT now(),
  estimated_days INTEGER NOT NULL
);

-- Insert sample data into companies table
INSERT INTO companies (company_name, brand) VALUES
('FastTrack Logistics', 'Ford'),
('Cargo Express Solutions', 'Chevrolet'),
('Swift Transport Co.', 'Toyota'),
('Elite Freight Services', 'Volvo'),
('Global Cargo Network', 'Mercedes');

-- Insert sample data into trucks table with correct company_id
INSERT INTO trucks (brand, load, truck_capacity, year, number_of_repairs, company_id) VALUES
('Ford', 5500, 8000.50, 2020, 3, 1),
('Chevrolet', 2300, 6500.75, 2018, 2, 2),
('Toyota', 4567, 6000.25, 2019, 4, 3),
('Volvo', 6000, 7500.25, 2017, 1, 4),
('Mercedes', 4000, 7000.00, 2019, 0, 5);

-- Insert sample data into employees table
INSERT INTO employees (first_name, last_name, years_of_service) VALUES
('Shivani', 'Varu', 5),
('Alice', 'Johnson', 8),
('Anaswara', 'Nair', 3),
('Nisha', 'Brown', 10),
('Binita', 'Khua', 7);

-- Insert sample data into drivers table
INSERT INTO drivers (employee_id, driver_category) VALUES
(1, 'Regular Driver'),
(2, 'Occasional Driver'),
(3, 'Regular Driver'),
(4, 'Occasional Driver'),
(5, 'Regular Driver');

-- Insert sample data into mechanics table
INSERT INTO mechanics (employee_id, specialized_brand) VALUES
(1, 'Ford'),
(2, 'Chevrolet'),
(3, 'Toyota'),
(4, 'Volvo'),
(5, 'Mercedes');

-- Insert sample data into customers table
INSERT INTO customers (customer_name, customer_address, customer_phone1, customer_phone2) VALUES
('John Doe', '123 Elm Street', '555-123-3456', '555-567-9876'),
('Jane Smith', '456 Oak Avenue', '555-876-8765', '555-432-1234'),
('Alice Johnson', '789 Pine Road', '555-246-9876', '555-135-9000'),
('David Taylor', '101 Maple Street', '555-654-1254', '555-789-4456'),
('Emily Brown', '202 Birch Avenue', '555-987-0003', '555-321-2213');

-- Insert sample data into truck_trips table
INSERT INTO truck_trips (route, truck_id, driver1_id, driver2_id) VALUES
('Coastal Highway Route', 1, 1, 2),
('Interstate 95 Route', 2, 3, 4),
('Mountain Pass Route', 3, 5, 2),
('Midwest Express Route', 4, 1, 3),
('East Coast Route', 5, 4, 2);

-- Insert sample data into shipments table
INSERT INTO shipments (weight, value, customer_id, origin, destination, truck_trip_id) VALUES
(1500.50, 2500.00, 1, 'Toronto', 'Kitchener', 1),
(2000.75, 3500.00, 2, 'Waterloo', 'Cambridge', 1),
(1800.25, 3000.00, 3, 'Cambridge', 'Brampton', 2),
(2200.00, 4000.00, 4, 'Hamilton', 'London', 2),
(1800.00, 3200.00, 5, 'Kitchener', 'Toronto', 3);

-- Insert sample data into truck_repairs table
INSERT INTO truck_repairs (truck_id, mechanic_id, start_date, end_date, estimated_days) VALUES
(1, 1, '2024-07-20 08:00:00', '2024-07-23 16:00:00', 3),
(2, 2, '2024-07-21 09:00:00', '2024-07-22 17:00:00', 2),
(3, 3, '2024-07-19 10:00:00', '2024-07-21 15:00:00', 2),
(4, 4, '2024-07-18 07:30:00', '2024-07-20 14:00:00', 2),
(5, 5, '2024-07-17 11:00:00', '2024-07-21 18:00:00', 5);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS truck_repairs CASCADE;
      DROP TABLE IF EXISTS shipments CASCADE;
      DROP TABLE IF EXISTS truck_trips CASCADE;
      DROP TABLE IF EXISTS mechanics CASCADE;
      DROP TABLE IF EXISTS drivers CASCADE;
      DROP TABLE IF EXISTS employees CASCADE;
      DROP TABLE IF EXISTS trucks CASCADE;
      DROP TABLE IF EXISTS companies CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;
    `);
  }
}


