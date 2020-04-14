import { Router, Request, Response } from 'express'

import { User } from '../model/User'
import { AuthRouter, requireAuth } from './auth.router'

const router: Router = Router()

router.use('/auth', AuthRouter)

router.post('/:id', (req: Request, res: Response) => {
  return res.status(403).send()
})

router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params
  const item = await User.findByPk(id)
  if (!item) {
    return res.status(404).send({ message: 'Wrong user ID' })
  }
  return res.status(200).send(item)
})

export const UserRouter: Router = router
