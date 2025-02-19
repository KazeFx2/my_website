import pkg from 'mongoose'
const { connect, connection } = pkg

connect('mongodb://172.22.0.2:27017/data', {
  // user: 'guest',
  // pass: 'guest'
  user: 'admin',
  pass: 'admin'
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => console.log('Mongodb Connected'))
  .catch((err) => console.log(err))

// const Connection = connection.useDb('data')

export default connection
