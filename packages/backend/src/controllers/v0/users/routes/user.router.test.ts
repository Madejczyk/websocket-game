import * as request from 'supertest'
import * as app from '../../../../server'

const GET_USER_INFO_URL = '/api/v0/users/test/'
const REGISTER_URL = '/api/v0/users/auth/'
const nick = 'nick'
const password = 'password'
const CORRECT_CREDENTIALS = {
  nick,
  password,
}

describe('GET Endpoints:', () => {
  describe('users', () => {
    describe('should return status code', () => {
      it('401 when unauthorization request', (done) => {
        request(app)
          .get(GET_USER_INFO_URL)
          .expect(401, { message: 'No authorization headers.' }, done)
      })

      it('TODO - 404 when user ID is wrong', (done) => {
        request(app)
          .post(REGISTER_URL)
          .send(CORRECT_CREDENTIALS)
          .set('Accept', 'application/json')
          .expect(201)
          .end((err, res) => {
            request(app)
              .get(`${GET_USER_INFO_URL}${nick}2`)
              .set('Authorization', res.body.token)
              .expect(404, { message: 'Wrong user ID' })
              .end(() => {
                request(app)
                  .delete(REGISTER_URL)
                  .send(CORRECT_CREDENTIALS)
                  .set('Accept', 'application/json')
                  .expect(200, done)
              })
          })
      })

      it('TODO - 200 when user ID is correct', (done) => {
        request(app)
          .post(REGISTER_URL)
          .send(CORRECT_CREDENTIALS)
          .set('Accept', 'application/json')
          .expect(201)
          .end((err, res) => {
            request(app)
              .get(`${GET_USER_INFO_URL}${nick}`)
              .set('Authorization', res.body.token)
              .expect(200, {
                test: 'test',
              })
              .end(() => {
                request(app)
                  .delete(REGISTER_URL)
                  .send(CORRECT_CREDENTIALS)
                  .set('Accept', 'application/json')
                  .expect(200, done)
              })
          })
      })
    })
  })
})
