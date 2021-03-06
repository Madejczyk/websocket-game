import { Router, Request, Response, NextFunction } from 'express'

import { User } from '../model/User'

import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { config } from '../../../../config/config'

const router: Router = Router()

async function generatePassword(plainTextPassword: string): Promise<string> {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(plainTextPassword, salt)
  return hash
}

async function comparePasswords(
  plainTextPassword: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hash)
}

function generateJWT(user: User): string {
  return jwt.sign(user.toJSON(), config.jwt.secret)
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ message: 'No authorization headers.' })
  }

  const tokenBearer = req.headers.authorization.split(' ')
  if (tokenBearer.length !== 2) {
    return res.status(401).send({ message: 'Malformed token.' })
  }

  const token = tokenBearer[1]

  return jwt.verify(token, config.jwt.secret, (err) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate.' })
    }
    return next()
  })
}

router.get('/verification', requireAuth, (req: Request, res: Response) => {
  return res.status(200).send({ auth: true, message: 'Authenticated.' })
})

router.get('/login', (req: Request, res: Response) => {
  return res.status(403).send()
})

router.post('/login', async (req: Request, res: Response) => {
  const nick = req.body.nick
  const password = req.body.password

  if (!nick || typeof nick !== 'string') {
    return res.status(400).send({ auth: false, message: 'Nick is required' })
  }

  if (!password || typeof password !== 'string') {
    return res
      .status(400)
      .send({ auth: false, message: 'Password is required' })
  }

  const user = await User.findByPk(nick)
  if (!user) {
    return res.status(401).send({ auth: false, message: 'Unauthorized' })
  }

  const authValid = await comparePasswords(password, user.password)
  if (!authValid) {
    return res.status(401).send({ auth: false, message: 'Unauthorized' })
  }

  const jwt = generateJWT(user)
  return res.status(200).send({ auth: true, token: jwt, user: user.short() })
})

// register
router.post('/', async (req: Request, res: Response) => {
  const nick = req.body.nick
  const plainTextPassword = req.body.password
  if (!nick || typeof nick !== 'string') {
    return res.status(400).send({ auth: false, message: 'Nick is required' })
  }
  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res
      .status(400)
      .send({ auth: false, message: 'Password is required' })
  }

  const user = await User.findByPk(nick)
  if (user) {
    return res
      .status(422)
      .send({ auth: false, message: 'User may already exist' })
  }

  const passwordHash = await generatePassword(plainTextPassword)

  const newUser = await new User({
    nick: nick,
    password: passwordHash,
  })

  const savedUser = await newUser.save()

  const jwt = generateJWT(savedUser)
  return res.status(201).send({ token: jwt, user: savedUser.short() })
})

// unregister
router.delete('/', async (req: Request, res: Response) => {
  const nick = req.body.nick
  const password = req.body.password

  if (!nick || typeof nick !== 'string') {
    return res.status(400).send({ message: 'Nick is required' })
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).send({ message: 'Password is required' })
  }

  const user = await User.findByPk(nick)
  if (!user) {
    return res.status(404).send()
  }

  const authValid = await comparePasswords(password, user.password)
  if (!authValid) {
    return res.status(401).send({ message: 'Unauthorized' })
  }

  user.destroy()
  return res.status(204).send()
})

router.get('/', (req: Request, res: Response) => {
  res.status(403).send()
})

export const AuthRouter: Router = router
