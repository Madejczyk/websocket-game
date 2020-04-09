import * as request from 'supertest'
import * as app from '../../../../server'

describe('Get Endpoints:', () => {
  describe('users', () => {
    describe('should return status code', () => {
      it('401 during unauthorization request', async (done) => {
        const res = await request(app).get('/api/v0/users/test')
        expect(res.statusCode).toEqual(401)
        done()
      })
    })
  })
})
