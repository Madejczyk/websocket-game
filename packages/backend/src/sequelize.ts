import { Sequelize } from 'sequelize-typescript'
import { config } from './config/config'

const c =
  process.env.NODE_ENV === 'test' ? config.postgressTest : config.postgress

export const sequelize = process.env.NODE_ENV === 'test' ? new Sequelize(
  process.env.DB_TEST_URI || '', {
  dialect: 'postgres',
  storage: ':memory:'
}) : new Sequelize({
  database: c.database,
  dialect: 'postgres',
  username: c.username,
  password: c.password,
  host: c.host,
  storage: ':memory:',
})
