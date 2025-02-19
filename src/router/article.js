import { Router } from 'express'
import { Types } from 'mongoose'
const appRouter = Router()
import articleSql from '../express/schema/article.js'
import ArticleExtSql from '../express/schema/atc_extend.js'
import queryUser from './user.js'
import identities from './identity.js'
import Save from './save.js'
import remove from './remove.js'
import Ext_atc from './ext_atc.js'
const options = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Shanghai'
}

function setOrigin(req, res) {
  res.header('Access-Control-Allow-Origin', req.get('origin'))
}

appRouter.get('/article', (req, res) => {
  setOrigin(req, res)
  identities.identityCheck(req, res, (req, res, st) => {
    if (req.query.id !== undefined) {
      let id = req.query.id
      articleSql
        .aggregate([
          {
            $addFields: {
              atcId: {
                $toString: '$_id'
              }
            }
          },
          {
            $lookup: {
              from: ArticleExtSql.extAtc,
              localField: 'atcId',
              foreignField: 'id',
              as: 'extAtc'
            }
          },
          {
            $unwind: '$extAtc'
          },
          {
            $project: {
              title: 1,
              body: 1,
              release: 1,
              modify: 1,
              tags: 1,
              cover: 1,
              desc: '$extAtc.desc',
              view: '$extAtc.view',
              comments: '$extAtc.comments',
              background: '$extAtc.background',
              hidden: '$extAtc.hidden'
            }
          },
          {
            $match: {
              _id: new Types.ObjectId(id)
            }
          }
        ])
        .then((atc) => {
          const formattedAtc = atc.map((plainObject) => {
            return {
              ...plainObject,
              modify:
                typeof plainObject.modify === 'object'
                  ? plainObject.modify.toLocaleString('zh-CN', options)
                  : 'null',
              release: plainObject.release.toLocaleString('zh-CN', options)
            }
          })
          if (req.query.noAdd === undefined)
            Ext_atc.articleViewAdd(id, (ct) => {
              formattedAtc[0].view = ct
              res.json(formattedAtc)
            })
          else {
            res.json(formattedAtc)
          }
        })
        .catch((err) => {
          res.json(err)
        })
      return
    }
    if (req.query.all !== undefined) {
      articleSql
        .aggregate([
          {
            $addFields: {
              atcId: {
                $toString: '$_id'
              }
            }
          },
          {
            $lookup: {
              from: ArticleExtSql.extAtc,
              localField: 'atcId',
              foreignField: 'id',
              as: 'extAtc'
            }
          },
          {
            $unwind: '$extAtc'
          },
          {
            $project: {
              title: 1,
              release: 1,
              modify: 1,
              tags: 1,
              cover: 1,
              desc: '$extAtc.desc',
              view: '$extAtc.view',
              comments: '$extAtc.comments',
              background: '$extAtc.background',
              hidden: '$extAtc.hidden'
            }
          }
        ])
        .sort({ release: -1 })
        .then((atc) => {
          const formattedAtc = atc.map((plainObject) => {
            return {
              ...plainObject,
              release: plainObject.release.toLocaleString('zh-CN', options)
            }
          })
          if (st.status === 0) res.json(formattedAtc)
          else {
            for (let i = formattedAtc.length - 1; i >= 0; i--)
              if (formattedAtc[i].hidden) formattedAtc.splice(i, 1)
            res.json(formattedAtc)
          }
        })
        .catch((err) => {
          res.json(err)
        })
      return
    }
  })
})

appRouter.get('/user', (req, res) => {
  setOrigin(req, res)
  queryUser(req, res)
})

appRouter.get('/identity', (req, res) => {
  setOrigin(req, res)
  identities.identityQuery(req, res)
})

appRouter.post('/save', Save.upload.single('file'), (req, res) => {
  setOrigin(req, res)
  Save.save(req, res)
})

appRouter.get('/image', (req, res) => {
  setOrigin(req, res)
  Save.getImage(req, res)
})

appRouter.get('/remove', (req, res) => {
  setOrigin(req, res)
  remove(req, res)
})

appRouter.get('/ip_port', (req, res) =>{
  setOrigin(req, res)
  let port = req.socket.remotePort
  let addr = req.socket.remoteAddress
  res.json({
    ip: addr,
    port: port
  })
})

export default appRouter
