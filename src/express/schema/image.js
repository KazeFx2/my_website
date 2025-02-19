import { Schema } from 'mongoose'
import Connection from '../connect/connect.js'
import { Buffer } from 'buffer'
const imageSchema = Schema(
  {
    // _id: Schema.ObjectId,
    name: String,
    type: String,
    encoding: String,
    size: Number,
    hash: Buffer,
    buffer: Buffer
  },
  { collection: 'image' }
)
let imageSql = Connection.model('image', imageSchema)
export default imageSql
