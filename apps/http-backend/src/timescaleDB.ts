import { prismaClient } from '@repo/db/prisma';

async function setupTimescaleDB() {

  try {
    console.log('Setting up TimescaleDB...');
    
    console.log('Enabling TimescaleDB extension...');
    await prismaClient.$executeRaw`CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE`;
    console.log('Converting table to hypertable...');
    await prismaClient.$executeRaw`
      SELECT create_hypertable('website_tick', 'createdAt');
    `;
    //no support in free tier
    //     console.log('Setting up retention policy...');
    // await prismaClient.$executeRaw`
    //   SELECT add_retention_policy('website_tick', INTERVAL '90 days');
    // `;

    console.log('TimescaleDB setup completed successfully!');
  } catch (error) {
    console.error('Error setting up TimescaleDB:', error);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

setupTimescaleDB();