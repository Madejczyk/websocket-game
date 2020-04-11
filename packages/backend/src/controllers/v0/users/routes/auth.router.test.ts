import * as request from 'supertest'
import * as app from '../../../../server'

const REGISTER_URL = '/api/v0/users/auth/'
const LOGIN_URL = '/api/v0/users/auth/login/'
const VERIFICATION_URL = '/api/v0/users/auth/verification/'
const nick = 'nick'
const password = 'password'
const CORRECT_CREDENTIALS = {
  nick,
  password,
}

describe('ENDPOINTS:', () => {
  describe('POST:', () => {
    describe('register', () => {
      describe('should return status code', () => {
        it('400 when nick is missing', (done) => {
          request(app)
            .post(REGISTER_URL)
            .expect(400, { auth: false, message: 'Nick is required' }, done)
        })

        it('400 when password is missing', (done) => {
          request(app)
            .post(REGISTER_URL)
            .send({
              nick,
            })
            .set('Accept', 'application/json')
            .expect(400, { auth: false, message: 'Password is required' }, done)
        })

        it('400 when password is not string', (done) => {
          request(app)
            .post(REGISTER_URL)
            .send({
              nick,
              password: {
                attack: 'by Object',
              },
            })
            .set('Accept', 'application/json')
            .expect(400, { auth: false, message: 'Password is required' }, done)
        })

        it('201 when nick and password are correct and user not exists', (done) => {
          request(app)
            .post(REGISTER_URL)
            .send(CORRECT_CREDENTIALS)
            .set('Accept', 'application/json')
            .expect(201)
            .end(() => {
              request(app)
                .delete(REGISTER_URL)
                .send(CORRECT_CREDENTIALS)
                .set('Accept', 'application/json')
                .expect(200, done)
            })
        })

        it('422 when user exists', (done) => {
          request(app)
            .post(REGISTER_URL)
            .send(CORRECT_CREDENTIALS)
            .set('Accept', 'application/json')
            .expect(201)
            .end(() => {
              request(app)
                .post(REGISTER_URL)
                .send(CORRECT_CREDENTIALS)
                .set('Accept', 'application/json')
                .expect(422, { auth: false, message: 'User may already exist' })
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

    describe('login', () => {
      describe('should return status code', () => {
        it('400 when nick is missing', (done) => {
          request(app)
            .post(LOGIN_URL)
            .expect(400, { auth: false, message: 'Nick is required' }, done)
        })

        it('400 when password is missing', (done) => {
          request(app)
            .post(LOGIN_URL)
            .send({
              nick: 'nick',
            })
            .set('Accept', 'application/json')
            .expect(400, { auth: false, message: 'Password is required' }, done)
        })

        it('400 when password is not string', (done) => {
          request(app)
            .post(LOGIN_URL)
            .send({
              nick: 'nick',
              password: {
                attack: 'by Object',
              },
            })
            .set('Accept', 'application/json')
            .expect(400, { auth: false, message: 'Password is required' }, done)
        })

        it('401 when user not exists', (done) => {
          request(app)
            .post(LOGIN_URL)
            .send(CORRECT_CREDENTIALS)
            .set('Accept', 'application/json')
            .expect(401, { auth: false, message: 'Unauthorized' }, done)
        })

        it('401 when password is incorrect', (done) => {
          request(app)
            .post(REGISTER_URL)
            .send(CORRECT_CREDENTIALS)
            .set('Accept', 'application/json')
            .expect(201)
            .end(() => {
              request(app)
                .post(LOGIN_URL)
                .send({
                  nick: 'nick',
                  password: 'password2',
                })
                .set('Accept', 'application/json')
                .expect(401, { auth: false, message: 'Unauthorized' })
                .end(() => {
                  request(app)
                    .delete(REGISTER_URL)
                    .send(CORRECT_CREDENTIALS)
                    .set('Accept', 'application/json')
                    .expect(200, done)
                })
            })
        })

        it('200 when password is correct', (done) => {
          request(app)
            .post(REGISTER_URL)
            .send(CORRECT_CREDENTIALS)
            .set('Accept', 'application/json')
            .expect(201)
            .end(() => {
              request(app)
                .post(LOGIN_URL)
                .send(CORRECT_CREDENTIALS)
                .set('Accept', 'application/json')
                .expect(200)
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

  describe('GET:', () => {
    describe('verification', () => {
      describe('should return status code', () => {
        it('401 when header authorization not exists', (done) => {
          request(app)
            .get(VERIFICATION_URL)
            .expect(401, { message: 'No authorization headers.' }, done)
        })

        it('401 when token is incorrect', (done) => {
          request(app)
            .get(VERIFICATION_URL)
            .set('Authorization', 'Incorrect')
            .expect(401, { message: 'Malformed token.' }, done)
        })

        it('500 when is incorrect authentication', (done) => {
          request(app)
            .get(VERIFICATION_URL)
            .auth('username', 'password')
            .expect(
              500,
              { auth: false, message: 'Failed to authenticate.' },
              done
            )
        })

        it('200 when is correct authentication', (done) => {
          request(app)
            .post(REGISTER_URL)
            .send(CORRECT_CREDENTIALS)
            .set('Accept', 'application/json')
            .expect(201)
            .end((err, res) => {
              request(app)
                .get(VERIFICATION_URL)
                .set('Authorization', res.body.token)
                .expect(200, { auth: true, message: 'Authenticated.' })
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
})
