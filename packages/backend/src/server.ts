import * as express from 'express'
import { Request, Response } from 'express'
import * as https from 'https'
import * as fs from 'fs'

import { IndexRouter } from './controllers/v0/index.router'
import { V0MODELS } from './controllers/v0/models'
import { sequelize } from './sequelize'
import { config } from './config/config'

const PORT_HTTPS_BACKEND = process.env.PORT || 3000
const PORT_FRONTEND = 8100

sequelize.addModels(V0MODELS)
if (process.env.NODE_ENV === 'test') {
  sequelize.sync() 
}

const app = express()
app.use(express.json())

// CORS Should be restricted
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `http://localhost:${PORT_FRONTEND}`);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('/api/v0/')
})

app.use('/api/v0/', IndexRouter)

const httpsServer = https.createServer({
  key: fs.readFileSync(config.https.keyPath),
  cert: fs.readFileSync(config.https.certPath),
}, app);

if (process.env.NODE_ENV !== 'test') {
  httpsServer.listen(PORT_HTTPS_BACKEND, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT_HTTPS_BACKEND}`)
    console.log(`press CTRL+C to stop server`)
});
}

module.exports = app;