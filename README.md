# Road Freight Transportation Project

### Objective:
The purpose of this project is to develop a system that can effectively manage all operations of a Road Freight Transportation company. This system will be able to track the company's trucks, employees, shipments, and trips. The project will enable the company to operate with improved efficiency and accuracy. This project utilizes modern technologies, such as TypeScript, TypeORM, and PostgreSQL. It also offers the convenience of easy deployment using Docker. Additionally, the project includes comprehensive tests to ensure the system functions reliably in various situations.

### Group Number: 04

## Roles and Responsibilities

| Team Member                  | Student ID | Roles and Responsibilities                                                      |
|------------------------------|------------|---------------------------------------------------------------------------------|
| Shivani Varu                 | 8941914    | Docker Containerization, Unit and Integration Testing, Migration Seeding, Web service CRUD, Readme File|
| Sunil Patel                  | 8984798    | Web CRUD, Unit and Integration Testing                                          |
| Vraj Soni                    | 8969071    | Web CRUD, Database Table Creation, Unit and Integration Testing                |
| Jenish Bhalala               | 8998191    | Unit and Integration Testing                                                    |
| Aman Nijhawan                | 8897412    | Database Schema Creation, ER-Diagram                                            |

### Technologies Used
- **PostgreSQL**: The primary database system used for storing all company data.
- **Docker**: A containerization tool used to encapsulate the application and its dependencies.
- **Node.js**: The runtime environment for executing TypeScript and JavaScript code.
- **TypeScript**: The primary language used for writing the project code and tests.
- **Express.js**: A web framework for building RESTful APIs.
- **TypeORM**: An Object-Relational Mapping (ORM) tool for TypeScript and JavaScript, used for data access and manipulation. Key components used include `Repository` and `EntityManager`.
- **ts-mockito**: A library for creating mock objects and verifying interactions in TypeScript tests. Utilized to create mocks and stubs for `Repository`, `EntityManager`, and other dependencies.
- **Jest**: A testing framework for running unit and integration tests.
- **pg-promise**: A PostgreSQL client providing advanced database functionalities.

## Tools Used
- **Visual Studio Code**: We use this powerful, open-source code editor for writing and editing the project's source code. It offers excellent support for debugging, syntax highlighting, and intelligent code completion, making our development process smoother and more efficient.
- **PgAdmin**: Our go-to tool for managing PostgreSQL databases. PgAdmin provides a user-friendly graphical interface that helps us interact with our databases, run queries, and manage database schemas easily.
- **Docker Desktop**: We use Docker Desktop to manage our Docker containers and images. This tool simplifies our development and deployment processes by providing an intuitive interface for building, running, and monitoring Docker containers.


## Database Tables and Data Types

### Companies Table

| Column       | Data Type    | Constraints |
|--------------|--------------|-------------|
| company_id   | SERIAL       | PRIMARY KEY |
| company_name | VARCHAR(255) | NOT NULL    |
| brand        | VARCHAR(255) | NOT NULL    |

### Trucks Table

| Column          | Data Type     | Constraints                                      |
|-----------------|---------------|--------------------------------------------------|
| truck_id        | SERIAL        | PRIMARY KEY                                      |
| brand           | VARCHAR(255)  | NOT NULL                                         |
| load            | INTEGER       | NOT NULL, DEFAULT 0                              |
| truck_capacity  | DECIMAL(10, 2)| NOT NULL, DEFAULT 0                              |
| year            | INTEGER       | NOT NULL                                         |
| number_of_repairs| INTEGER      | NOT NULL, DEFAULT 0                              |
| company_id      | INTEGER       | REFERENCES companies(company_id) ON DELETE CASCADE|

### Employees Table

| Column           | Data Type    | Constraints |
|------------------|--------------|-------------|
| employee_id      | SERIAL       | PRIMARY KEY |
| first_name       | VARCHAR(50)  | NOT NULL    |
| last_name        | VARCHAR(50)  | NOT NULL    |
| years_of_service | INTEGER      | NOT NULL    |

### Drivers Table

| Column           | Data Type    | Constraints                                            |
|------------------|--------------|--------------------------------------------------------|
| driver_id        | SERIAL       | PRIMARY KEY                                            |
| employee_id      | INTEGER      | REFERENCES employees(employee_id) ON DELETE CASCADE    |
| driver_category  | VARCHAR(255) | NOT NULL                                               |

### Mechanics Table

| Column           | Data Type    | Constraints                                                |
|------------------|--------------|------------------------------------------------------------|
| mechanic_id      | SERIAL       | PRIMARY KEY                                                |
| employee_id      | INTEGER      | REFERENCES employees(employee_id) ON DELETE CASCADE        |
| specialized_brand| VARCHAR(255) | NOT NULL, DEFAULT 'Unknown'                                |

### Customers Table

| Column           | Data Type    | Constraints |
|------------------|--------------|-------------|
| customer_id      | SERIAL       | PRIMARY KEY |
| customer_name    | VARCHAR(255) | NOT NULL    |
| customer_address | VARCHAR(255) | NOT NULL    |
| customer_phone1  | VARCHAR(15)  | NOT NULL    |
| customer_phone2  | VARCHAR(15)  | NOT NULL    |

### Truck_Trips Table

| Column       | Data Type     | Constraints                                         |
|--------------|---------------|-----------------------------------------------------|
| truck_trip_id| SERIAL        | PRIMARY KEY                                         |
| route        | VARCHAR(255)  | NOT NULL                                            |
| truck_id     | INTEGER       | REFERENCES trucks(truck_id) ON DELETE CASCADE       |
| driver1_id   | INTEGER       | REFERENCES drivers(driver_id) ON DELETE SET NULL    |
| driver2_id   | INTEGER       | REFERENCES drivers(driver_id) ON DELETE SET NULL    |

### Shipments Table

| Column        | Data Type     | Constraints                                           |
|---------------|---------------|-------------------------------------------------------|
| shipment_id   | SERIAL        | PRIMARY KEY                                           |
| weight        | DECIMAL(10, 2)| NOT NULL, DEFAULT 0                                   |
| value         | DECIMAL(10, 2)| NOT NULL                                              |
| customer_id   | INTEGER       | REFERENCES customers(customer_id) ON DELETE CASCADE   |
| origin        | VARCHAR(255)  | NOT NULL                                              |
| destination   | VARCHAR(255)  | NOT NULL                                              |
| truck_trip_id | INTEGER       | REFERENCES truck_trips(truck_trip_id) ON DELETE CASCADE|

### Truck_Repairs Table

| Column         | Data Type     | Constraints                                           |
|----------------|---------------|-------------------------------------------------------|
| repair_id      | SERIAL        | PRIMARY KEY                                           |
| truck_id       | INTEGER       | REFERENCES trucks(truck_id) ON DELETE CASCADE         |
| mechanic_id    | INTEGER       | REFERENCES mechanics(mechanic_id) ON DELETE CASCADE   |
| start_date     | TIMESTAMP     | NOT NULL, DEFAULT now()                               |
| end_date       | TIMESTAMP     | NOT NULL, DEFAULT now()                               |
| estimated_days | INTEGER       | NOT NULL                                              |


### Steps
1. Initialize the project with TypeORM for PostgreSQL and Docker **THIS STEP IS JUST FOR UNDERSTANDING, NO NEED TO DO**
    ```bash
    npx typeorm init --name final-project --database postgres --docker
    ```
    
1. Clone the repository:
    ```bash
    git clone https://github.com/shivi-1010/final-project.git
    cd final-project
    ```
2. Install necessary packages and dependencies:
    ```bash
    npm install 
    ```
3. Compile and Run
    ```bash
    Remove-Item -Recurse -Force .\dist\
    ```
    ```bash
    npm run build
     ```
    ```bash
    npx tsc
    ```
4. Migration and Seeding to database. 
    ```bash
    npm run migration:revert
    ```
    ```bash
    npm run migration:run    
    ```
5. Web service CRUD will run on http://localhost:4000/
    ```bash
    npm run start
    ```
6. Unit tests and Integration Tests 
    ```bash
    npm run test
    npx jest --verbose (for proper testing viewing with green tick mark to see successfull testing for both Unit test and Integration test)
    ```

### Docker Setup

1. **Stop and Remove Existing Docker Containers and Images**
    ```bash
    docker stop final-project-postures
    docker rm final-project-postgres
    docker rmi postgres
    ```
1. **Login to Docker:**
   ```bash
      docker login
   ```
2. **Start Docker containers:**
   ```bash
    docker-compose up -d
    docker-compose up --build
   ```
3. **Pull the PostgreSQL Docker image:**
   ```bash
    docker pull postgres
   ```
4. **Run the PostgreSQL container:**
     ```bash
    docker run --name final-project-postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
   ```
5. **Access psql inside the container:**
   ```bash
   docker exec -it final-project-postgres /bin/sh
   ```
6. **List all databases:**
   ```bash
      docker login
   ```
7. **Connect to the `testdatabase`:**
     ```bash
      psql -U postgres -d testdatabase
   ```
8. **List all databases**
    ```bash
     \l
   ```
9. **Connect to the testdatabase**
   ```bash
   \c testdatabase
   ```
10. **List all tables (there should be none initially)**
    ```bash
    \dt
    ```
11. **Exit psql**
    ```bash
    \q
    ```
12.**Exit the container shell**
    ```bash
    exit
    ```
	
