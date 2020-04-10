import { Sequelize } from 'sequelize-typescript'
import { config } from './config/config'

const c = config.postgress

export const sequelize = new Sequelize({
  database: process.env.NODE_ENV === 'test' ? c.databaseTest : c.database,
  dialect: 'postgres',
  username: c.username,
  password: c.password,
  host: c.host,
  storage: ':memory:',
})
