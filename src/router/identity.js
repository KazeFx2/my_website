import identitySql from '../express/schema/identity.js'

const timeoutDays = 7

function identityCheck(req, res, callback) {
  if (req.query.identity != undefined || req.cookies.identity != undefined) {
    identitySql
      .find({
        identity: req.query.identity != undefined ? req.query.identity : req.cookies.identity
      })
      .then((data) => {
        if (data.length === 0) {
          callback(req, res, {
            status: 1,
            data: 'no such identity'
          })
        } else {
          const now = new Date()
          const ms = now - data[0].date
          const days = ms / 1000 / 60 / 60 / 24
          if (days > timeoutDays) {
            identitySql
              .deleteMany({ identity: data[0].identity })
              .then(() => {
                // console.log(res)
              })
              .catch((e) => {
                console.log('ERROR IN IDENTITY DELETE', e)
              })
            callback(req, res, {
              status: 1,
              data: 'no such identity'
            })
          } else {
            callback(req, res, {
              status: 0,
              data: data[0].userid
            })
          }
        }
      })
      .catch((e) => {
        console.log('ERROR IN IDENTITY', e)
      })
  } else {
    callback(req, res, {
      status: -1,
      data: 'identity not found'
    })
  }
}

function identityQuery(req, res) {
  identityCheck(req, res, (r, re, st) => {
    re.json(st)
  })
}

export default { identityQuery, identityCheck }
