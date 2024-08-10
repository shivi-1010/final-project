const { DataSource } = require('typeorm');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Read ormconfig.json
const configPath = path.resolve(__dirname, 'ormconfig.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Adjust the configuration for testing by replacing placeholders with actual values
config.host = process.env.DATABASE_HOST;
config.port = parseInt(process.env.DATABASE_PORT, 10);
config.username = process.env.DATABASE_USER;
config.password = process.env.DATABASE_PASSWORD;
config.database = process.env.DATABASE_NAME;
config.synchronize = true;
config.dropSchema = true;

let dataSource;

beforeAll(async () => {
  if (!dataSource) {
    dataSource = new DataSource(config);
    await dataSource.initialize();
    global.dataSource = dataSource;
  }
});

beforeEach(async () => {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  }
});

afterAll(async () => {
  if (dataSource) {
    await dataSource.destroy();
  }
});
