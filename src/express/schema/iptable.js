import { Schema } from 'mongoose'
import Connection from '../connect/connect.js'
const iptableSchema = Schema(
  {
    // _id: Schema.ObjectId,
    ip: String,
    count: Number,
    first: Date
  },
  { collection: 'iptable' }
)
let iptableSql = Connection.model('iptable', iptableSchema)
export default iptableSql
