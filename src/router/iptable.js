import iptableSql from '../express/schema/iptable.js'

const min = 60
const max = 5

function checkIp(ip, callback) {
  iptableSql
    .find({ ip: ip })
    .then((st) => {
      if (st.length === 0) {
        // Add
        const newVal = new iptableSql({
          ip: ip,
          count: 0,
          first: new Date()
        })
        newVal
          .save()
          .then(() => {
            callback(true, max)
          })
          .catch(() => {
            callback(false, -1)
          })
      } else {
        // Check
        if (st[0].count < max) {
          let left = max - st[0].count
          callback(true, left)
        } else {
          const now = new Date()
          const ms = now - st[0].first
          const s = ms / 1000
          if (s > min * 60) {
            iptableSql
              .updateOne(
                { ip: ip },
                {
                  first: now,
                  count: 0
                }
              )
              .then(() => {
                callback(true, max)
              })
              .catch(() => {
                callback(false, -1)
              })
          } else {
            callback(false, min * 60 - s)
          }
        }
      }
    })
    .catch(() => {
      callback(false, -1)
    })
}

function Reset(ip) {
  iptableSql
    .updateOne(
      { ip: ip },
      {
        count: 0
      }
    )
    .then(() => {})
}

function AddOne(ip) {
  iptableSql.find({ ip: ip }).then((st) => {
    if (st.length === 0) {
      const newVal = new iptableSql({
        ip: ip,
        count: 1,
        first: new Date()
      })
      newVal.save()
    } else {
      iptableSql
        .updateOne(
          { ip: ip },
          {
            count: st[0].count + 1
          }
        )
        .then(() => {})
    }
  })
}

export default { checkIp, AddOne, Reset }
