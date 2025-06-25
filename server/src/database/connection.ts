import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_NAME = 'fan_meet_greet',
  DB_USER = 'postgres',
  DB_PASSWORD = 'postgres',
  NODE_ENV = 'development',
} = process.env;

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  logging: NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
  } catch (error) {
    logger.error(`Unable to connect to the database: ${error}`);
    process.exit(1);
  }
};