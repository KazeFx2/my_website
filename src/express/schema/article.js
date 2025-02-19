import { Schema } from 'mongoose'
import Connection from '../connect/connect.js'
const articleSchema = Schema(
  {
    // _id: Schema.ObjectId,
    title: String,
    body: String,
    release: Date,
    modify: Schema.Types.Mixed,
    tags: Array,
    cover: String
  },
  { collection: 'article' }
)
let articleSql = Connection.model('article', articleSchema)
export default articleSql
