import { Schema } from 'mongoose'
import Connection from '../connect/connect.js'
const extAtc = 'ext_article'
const articleExtSchema = Schema(
  {
    // _id: Schema.ObjectId,
    id: String,
    desc: String,
    view: Number,
    comments: Number,
    background: String,
    hidden: Boolean
  },
  { collection: extAtc }
)
let articleExtSql = Connection.model(extAtc, articleExtSchema)
export default { articleExtSql, extAtc }
