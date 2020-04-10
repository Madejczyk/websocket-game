import * as request from 'supertest'
import * as app from '../../../../server'

const REGISTER_URL = '/api/v0/users/auth/'
const LOGIN_URL= '/api/v0/users/auth/login/'
const nick = 'nick'
const password = 'password'
const CORRECT_CREDENTIALS = {
  nick,
  password
}

describe('Post Endpoints:', () => {
  describe('register', () => {
    describe('should return status code', () => {
      it('400 when nick is missing', () => {
        return new Promise((done) => {
          request(app)
            .post(REGISTER_URL)
            .expect(400, { auth: false, message: 'Nick is required' }, done)
        })
      })

      it('400 when password is missing', () => {
        return new Promise((done) => {
          request(app)
            .post(REGISTER_URL)
            .send({
              nick,
            })
            .set('Accept', 'application/json')
            .expect(400, { auth: false, message: 'Password is required' }, done)
        })
      })

      it('400 when password is not string', () => {
        return new Promise((done) => {
          request(app)
            .post(REGISTER_URL)
            .send({
              nick,
              password: {
                "attack": "by Object"
              }
            })
            .set('Accept', 'application/json')
            .expect(400, { auth: false, message: 'Password is required' }, done)
        })
      })

      it('201 when nick and password are correct and user not exists', () => {
        return new Promise((done) => {
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
      })

      it('422 when user exists', () => {
        return new Promise((done) => {
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
  })

  describe('login', () => {
    describe('should return status code', () => {
      it('400 when nick is missing', () => {
        return new Promise((done) => {
          request(app)
            .post(LOGIN_URL)
            .expect(400, { auth: false, message: 'Nick is required' }, done)
        })
      })

      it('400 when password is missing', () => {
        return new Promise((done) => {
          request(app)
            .post(LOGIN_URL)
            .send({
              nick: 'nick',
            })
            .set('Accept', 'application/json')
            .expect(400, { auth: false, message: 'Password is required' }, done)
        })
      })

      it('400 when password is not string', () => {
        return new Promise((done) => {
          request(app)
            .post(LOGIN_URL)
            .send({
              nick: 'nick',
              password: {
                "attack": "by Object"
              }
            })
            .set('Accept', 'application/json')
            .expect(400, { auth: false, message: 'Password is required' }, done)
        })
      })

      it('401 when user not exists', () => {
        return new Promise((done) => {
          request(app)
            .post(LOGIN_URL)
            .send(CORRECT_CREDENTIALS)
            .set('Accept', 'application/json')
            .expect(401, { auth: false, message: 'Unauthorized' }, done)
        })
      })

      it('401 when password is incorrect', () => {
        return new Promise((done) => {
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
                password: 'password2'
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
      })

      it('200 when password is correct', () => {
        return new Promise((done) => {
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
})
