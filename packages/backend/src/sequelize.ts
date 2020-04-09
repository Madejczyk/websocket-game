import {Sequelize} from 'sequelize-typescript';
import { config } from './config/config';


const c = config.postgress;

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
  database: c.database,
  dialect: 'postgres',
  username: c.username,
  password: c.password,
  host: c.host,
  storage: ':memory:'
});
