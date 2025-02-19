import { Schema } from 'mongoose'
import Connection from '../connect/connect.js'
const tagSchema = Schema(
  {
    // _id: Schema.ObjectId,
    name: String,
    ids: Array
  },
  { collection: 'tag' }
)
let tagSql = Connection.model('tag', tagSchema)
export default tagSql
