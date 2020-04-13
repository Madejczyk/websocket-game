import * as request from 'supertest'
import * as app from '../../../../server'

const REGISTER_URL = '/api/v0/users/auth/'
const nick = 'nickUserRouterTest'
const GET_USER_INFO_URL = `/api/v0/users/${nick}`
const password = 'password'

const CORRECT_CREDENTIALS = {
  nick,
  password,
}

let token: string
describe('Endpoints:', () => {
  describe('GET:', () => {
    describe('users', () => {
      describe('should return status code', () => {
        beforeAll((done) => {
          request(app)
            .post(REGISTER_URL)
            .send(CORRECT_CREDENTIALS)
            .set('Accept', 'application/json')
            .expect(201)
            .end((err, res) => {
              if (err) {
                return done(err)
              }
              token = `Bearer ${res.body.token}`
              done()
            })
        })
  
        afterAll((done) => {
          token = ''
          request(app)
            .delete(REGISTER_URL)
            .send(CORRECT_CREDENTIALS)
            .set('Accept', 'application/json')
            .expect(204, done)
        })
  
        it('401 when unauthorization request', (done) => {
          request(app)
            .get(GET_USER_INFO_URL)
            .expect(401, { message: 'No authorization headers.' }, done)
        })
  
        it('404 when user ID is wrong', (done) => {
          request(app)
            .get(`${GET_USER_INFO_URL}2`)
            .set('Authorization', token)
            .expect(404, { message: 'Wrong user ID' }, done)
        })
  
        it('200 when user ID is correct', (done) => {
          request(app)
            .get(GET_USER_INFO_URL)
            .set('Authorization', token)
            .expect(200, done)
        })
      })
    })
  })
  describe('POST', () => {
    it('should return 403', (done) => {
      request(app)
        .post(GET_USER_INFO_URL)
        .expect(403, done)
    })
  })
})
