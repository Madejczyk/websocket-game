import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Request, Response } from 'express'
import { IndexRouter } from './controllers/v0/index.router'

const PORT_BACKEND = process.env.NODE_ENV === 'test' ? 3001 : process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

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