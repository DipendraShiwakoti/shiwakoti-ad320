import { Router } from 'express'
import { User } from '../models/User.js'

const usersRouter = Router()
function sanitizerUsers(users) {
  console.log(users)
  const sanitizedUsers = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    decks: user.decks,
    active: user.active
  }))
  return sanitizedUsers
}

const getUsers = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  if (requestor.role === 'admin' || requestor.role === 'superuser') {
    const users = await User.find({})
    res.send(sanitizerUsers(users))
  } else {
    res.status(403).send('Forbidden')
  }
}

const getUsersById = async (req, res) => {
  const requestor = await User.findById(userId)
  const { userId } = req.user
  if (requestor.role === 'admin' || requestor.role === 'superuser') {
    const user = await User.findById(req.params.id)
  } else if(requestor.role === 'user' && requestor.id === user.id){
    res.send(sanitizerUsers(users))
  } else{}
  try {
    const user = await User.findById(req.params.id)
    res.send(sanitizerUsers([user]))
  } catch (err) {
    console.log(`Error getting usiser by id: ${err}`)
    res.sendStatus(500)
  }
}

const updateUser = async (req, res) => {
  if (req.user.role === 'admin' || req.user.userId === req.parms.id) {
    const result = await User.findByIdAndUpdate(req.params.id, req.body)
    console.log('result', result)
    res.sendStatus(503)
  } else {
    res.status(404).send('cant update the user')
  }
}

const deleteUser = async (req, res) => {
  if (req.role === 'admin' || req.user.userId === req.params.id) {
    const result = await User.findByIdAndUpdate(req.params.id, { active: false })
    console.log('result ', result)
    res.sendStatus(503)
  } else {
    res.sendStatus(404).send('unable to delete user')
  }
}

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUsersById)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)

export default usersRouter
