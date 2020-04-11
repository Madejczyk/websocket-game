import * as request from 'supertest'
import * as app from './../../server'

const VERSION_0_URL = '/api/v0/'

describe('GET Endpoints:', () => {
  it('for version 0', (done) => {
    request(app).get(VERSION_0_URL).expect(200, done)
  })
})
