import { Schema } from 'mongoose'
import Connection from '../connect/connect.js'
const identitySchema = Schema(
  {
    // _id: Schema.ObjectId,
    identity: String,
    userid: String,
    date: Date
  },
  { collection: 'identity' }
)
let identitySql = Connection.model('identity', identitySchema)
export default identitySql
