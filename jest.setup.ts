import { AppDataSource } from './src/data-source';

beforeAll(async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.error('Error during Data Source initialization', error);
    process.exit(1);
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});



// import { AppDataSource } from './src/data-source';

// // Run before all tests
// beforeAll(async () => {
//   try {
//     console.log('Initializing database connection...');
//     await AppDataSource.initialize();
//     console.log('Database initialized.');
//   } catch (error) {
//     console.error('Error initializing database:', error);
//     process.exit(1); // Exit process with failure
//   }
// });

// // Run after all tests
// afterAll(async () => {
//   try {
//     console.log('Destroying database connection...');
//     await AppDataSource.destroy();
//     console.log('Database destroyed.');
//   } catch (error) {
//     console.error('Error destroying database:', error);
//   }
// });
