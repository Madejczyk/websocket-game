export const config = {
  postgress: {
    username: process.env.POSTGRES_USERNAME || '',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DATABASE || '',
    host: process.env.POSTGRES_HOST || '',
  },
  postgressTest: {
    username: process.env.POSTGRES_USERNAME_TEST || '',
    password: process.env.POSTGRES_PASSWORD_TEST || '',
    database: process.env.POSTGRES_DATABASE_TEST || '',
    host: process.env.POSTGRES_HOST_TEST || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
  },
  https: {
    keyPath: process.env.HTTPS_PATH_KEY || './key.pem',
    certPath: process.env.HTTPS_PATH_CERT || './cert.pem',
  },
}
