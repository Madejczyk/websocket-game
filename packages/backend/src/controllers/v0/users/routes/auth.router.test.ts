import * as request from 'supertest'
import * as app from '../../../../server'

describe('Post Endpoints:', () => {
  describe('register', () => {
    describe('should return status code', () => {
      it('400 when nick is missing', () => {
        return new Promise((done) => {
          request(app)
            .post('/api/v0/users/auth/')
            .expect(400, { auth: false, message: 'Nick is required' }, done)
        })
      })

      it('400 when password is missing', () => {
        return new Promise((done) => {
          request(app)
            .post('/api/v0/users/auth/')
            .send({
              nick: 'nick',
            })
            .set('Accept', 'application/json')
            .expect(400, { auth: false, message: 'Password is required' }, done)
        })
      })

      it('201 when nick and password are correct and user not exists', () => {
        return new Promise((done) => {
          request(app)
            .post('/api/v0/users/auth/')
            .send({
              nick: 'nick',
              password: 'password',
            })
            .set('Accept', 'application/json')
            .expect(201)
            .end(() => {
              request(app)
                .delete('/api/v0/users/auth/')
                .send({
                  nick: 'nick',
                  password: 'password',
                })
                .set('Accept', 'application/json')
                .expect(200, done)
            })
        })
      })

      it('422 when user exists', () => {
        return new Promise((done) => {
          request(app)
            .post('/api/v0/users/auth/')
            .send({
              nick: 'nick',
              password: 'password',
            })
            .set('Accept', 'application/json')
            .expect(201)
            .end(() => {
              request(app)
                .post('/api/v0/users/auth/')
                .send({
                  nick: 'nick',
                  password: 'password',
                })
                .set('Accept', 'application/json')
                .expect(422, { auth: false, message: 'User may already exist' })
                .end(() => {
                  request(app)
                    .delete('/api/v0/users/auth/')
                    .send({
                      nick: 'nick',
                      password: 'password',
                    })
                    .set('Accept', 'application/json')
                    .expect(200, done)
                })
            })
        })
      })
    })
  })
})
