import * as request from 'supertest'
import * as app from '../../../../server'

describe('Get Endpoints:', () => {
  describe('users', () => {
    describe('should return status code', () => {
      it('401 when unauthorization request', () => {
        return new Promise((done) => {
          request(app)
            .get('/api/v0/users/test')
            .expect(401, { message: 'No authorization headers.' }, done)
        })
      })

      it.skip('TODO - 404 when user ID is wrong', () => {
        // TODO
      })

      it.skip('TODO - 200 when user ID is correct', () => {
        // TODO
      })
    })
  })
})
