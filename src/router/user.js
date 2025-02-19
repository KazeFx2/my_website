import userSql from '../express/schema/user.js'
import identitySql from '../express/schema/identity.js'
import IPChecks from './iptable.js'
import CryptoJS from 'crypto-js'

function generateRandom256BitString() {
  const randomBytes = CryptoJS.lib.WordArray.random(32) // 256 bits = 32 bytes
  const randomString = CryptoJS.enc.Hex.stringify(randomBytes)
  return randomString
}

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    ''
  )
}

function queryUser(req, res) {
  let ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/)
  ip = ip ? ip.join('.') : null
  IPChecks.checkIp(ip, (st, val) => {
    if (!st) {
      if (val === -1) {
        res.json({
          status: -1,
          data: 'failed'
        })
      } else {
        res.json({
          status: 3,
          data: val
        })
      }
      return
    }
    if (req.query.username != undefined && req.query.password != undefined) {
      userSql
        .find({ username: req.query.username })
        .then((data) => {
          if (data.length === 0) {
            res.json({
              status: 1,
              data: 'no such user'
            })
          } else {
            if (data[0].password === req.query.password) {
              const id = generateRandom256BitString()
              identitySql.deleteMany({ userid: data[0]._id.toString() }).then(() => {
                const newVal = identitySql({
                  identity: id,
                  userid: data[0]._id.toString(),
                  date: new Date()
                })
                newVal.save().then(() => {
                  res.cookie('identity', id, {
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7天的有效期
                    httpOnly: true, // 仅通过HTTP访问，不允许通过客户端脚本访问
                    // secure: process.env.NODE_ENV === 'production', // 仅在HTTPS时生效
                    secure: true,
                    sameSite: 'None' // 允许跨站点请求，需要与Secure结合使用
                  })
                  IPChecks.Reset(ip)
                  res.json({
                    status: 0,
                    data: id
                  })
                })
              })
            } else {
              // console.log(req)
              // console.log(req.ips)
              // console.log("x-forwarded-for    = " + req.header('x-forwarded-for'));// 各阶段ip的CSV, 最左侧的是原始ip
              // console.log("ips                          = " + JSON.stringify(req.ips));// 相当于(req.header('x-forwarded-for') || '').split(',')
              // console.log("remote Address     = " + req.connection.remoteAddress);// 未发生代理时，请求的ip
              // console.log("ip                            = " + req.ip);// 同req.connection.remoteAddress, 但是格式要好一些
              IPChecks.AddOne(ip)
              res.json({
                status: 2,
                data: val - 1
              })
            }
          }
        })
        .catch((e) => {
          console.log('ERROR IN USERSQL', e)
        })
    } else {
      res.json({
        status: -1,
        data: 'username or password not found'
      })
    }
  })
}

export default queryUser
