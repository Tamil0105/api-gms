
import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres', // Change this according to your DB (e.g., 'mysql')
  host: 'pg-1dbd63ba-chysir-8ac8.i.aivencloud.com',
  port: 17179, // Change according to your DB
  username: 'avnadmin',
  password: 'AVNS_U8r_wbX49tyOfvkhVeV',
  database: 'defaultdb',
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/migrations/*{.ts,.js}"],// Migration path
  synchronize: true, // Set to 'false' in production
  logging: true,
  ssl: { rejectUnauthorized: false }, // Add this line for SSL


}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);