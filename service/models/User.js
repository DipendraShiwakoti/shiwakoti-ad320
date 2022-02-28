import mongoose from 'mongoose'


const UserSchema = new mongoose.Schema({
  Fname: String, 
  Lname: String,
  userID: String,
})

export const User = mongoose.model('User', UserSchema)