import express from 'express'
import cookieParser from 'cookie-parser'
import https from 'https'
import fs from 'fs'
import path from 'path'
const app = express()

const __dirname = '/web/kaze_web/src'

const options = {
  key: fs.readFileSync(path.join(__dirname, './ssl/kazefx.top.key')),
  cert: fs.readFileSync(path.join(__dirname, './ssl/kazefx.top.pem'))
}

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://kazefx.top')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

import appRouter from '../router/article.js'
// app.set('trust proxy', true);
// app.set('trust proxy', 'loopback, 172.17.0.1')
app.use(cookieParser())
app.use(express.json())
app.use('/api', appRouter)

const Server = https.createServer(options, app)

Server.listen(3000, () => {
  console.log('app 3000')
})
