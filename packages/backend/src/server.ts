import * as express from 'express'
import { Request, Response } from 'express'
import { IndexRouter } from './controllers/v0/index.router'
import { V0MODELS } from './controllers/v0/models'
import { sequelize } from './sequelize'

const PORT_BACKEND = process.env.NODE_ENV === 'test' ? 3001 : process.env.PORT || 3000

sequelize.addModels(V0MODELS)
// sequelize.sync() // CALL if model will changed
const app = express()
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('/api/v0/')
})

app.use('/api/v0/', IndexRouter)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT_BACKEND, () => {
    console.log(`server running http://localhost:${PORT_BACKEND}`)
    console.log(`press CTRL+C to stop server`)
  })
}

module.exports = app;