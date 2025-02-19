import { Schema } from 'mongoose'
import Connection from '../connect/connect.js'
const userSchema = Schema(
  {
    // _id: Schema.ObjectId,
    username: String,
    password: String
  },
  { collection: 'users' }
)
let userSql = Connection.model('users', userSchema)
export default userSql
