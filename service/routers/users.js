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
  const { userId } = req.user
  const requestor = await User.findById(userId)
  if (requestor.role === 'admin' || req.user.role === 'superUser' || requestor._id.toString() === req.params.id.toString()) {
    const users = await User.findById(req.params.id)
    res.send(users)
  } else {
    res.status(404).send('This route is only for admin and superuser')
  }
}

const updateUser = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  if (requestor.role === 'admin' || req._id.toString() === req.params.id.toString()) {
    const result = await User.findByIdAndUpdate(req.params.id, req.body)
    console.log('result', result)
    res.sendStatus(503)
  } else {
    res.status(404).send('You are not authorized to update this info')
  }
}

const deleteUser = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  if (requestor.role === 'admin' || requestor._Id.toString === req.params.id.toString) {
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
