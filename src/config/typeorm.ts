
import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { Contact, User } from "../entity";
import { NewsFeed } from "../entity/news.entity";
import { Testimonial } from "../entity/testimonials.entity";
import { DataSource, DataSourceOptions } from "typeorm";
import { Carousel } from "../entity/carouselImage";
import { Portfolio } from "../entity/portFolio.entity";

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres', // Change this according to your DB (e.g., 'mysql')
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432, // Change according to your DB
  username: 'postgres.bbbzdlyncfcnmzxxaubm',
  password: 'bcfd4UKJWgFXbBDs',
  database: 'postgres',
  entities:  [User,NewsFeed,Contact,Testimonial,Carousel,Portfolio],
  migrations: ["dist/migrations/*{.ts,.js}"],// Migration path
  synchronize: true, // Set to 'false' in production
  logging: true,
  ssl: { rejectUnauthorized: false }, // Add this line for SSL


}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);