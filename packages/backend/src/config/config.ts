export const config = {
  postgress: {
    username: process.env.POSTGRES_USERNAME || '',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DATABASE || '',
    databaseTest: process.env.POSTGRES_DATABASE_TEST || '',
    host: process.env.POSTGRES_HOST || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
  },
}
