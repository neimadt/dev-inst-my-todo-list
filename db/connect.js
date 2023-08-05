import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schemas/index.js';

console.log(process.env.DB_CONNECTION_STRING);

const client = postgres(process.env.DB_CONNECTION_STRING, { ssl: 'prefer' });
export const dbConnect = drizzle(client, { schema });
