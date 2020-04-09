import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Request, Response } from 'express'
import { IndexRouter } from './controllers/v0/index.router'
import { V0MODELS } from './controllers/v0/models'
import { sequelize } from './sequelize'

;(async () => {
  const PORT_BACKEND = process.env.PORT || 3000

  await sequelize.addModels(V0MODELS)
  await sequelize.sync()

  const app = express()
  app.use(bodyParser.json())

  app.get('/', (req: Request, res: Response) => {
    res.send('/api/v0/')
  })

  app.use('/api/v0/', IndexRouter)

  app.listen(PORT_BACKEND, () => {
    console.log(`server running http://localhost:${PORT_BACKEND}`)
    console.log(`press CTRL+C to stop server`)
  })
})()
