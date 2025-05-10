import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL!');
    return client.end();
  })
  .catch(err => console.error('❌ Connection failed:', err.message)); 