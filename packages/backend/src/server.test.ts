import * as request from 'supertest'
import * as app from './server'

const ROOT_URL = '/'
describe('GET Endpoints:', () => {
  it('root', (done) => {
    request(app).get(ROOT_URL).expect(200, done)
  })
})
