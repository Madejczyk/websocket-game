import * as request from 'supertest'
import * as app from '../../../../server'

const GET_USER_INFO_URL = '/api/v0/users/test'

describe('Get Endpoints:', () => {
  describe('users', () => {
    describe('should return status code', () => {
      it('401 when unauthorization request', () => {
        return new Promise((done) => {
          request(app)
            .get(GET_USER_INFO_URL)
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
