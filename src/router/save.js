import articleSql from '../express/schema/article.js'
import identities from './identity.js'
import ExtAtc from './ext_atc.js'
import { Buffer } from 'buffer'
import multer from 'multer'
import crypto from 'crypto'
import imageSql from '../express/schema/image.js'
import Tags from './tag.js'

// console.log(123)
// console.log(req.file)
// const hash = crypto.createHash('sha256');
// hash.update(req.file.buffer)
// const hashHex = hash.digest()
// console.log(hashHex)
// checkHash(hashHex.toString('hex'))
// res.setHeader('Content-Type', 'image/jpeg')
// res.status(200).send(req.file.buffer)

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage
})

function checkHash(hashString, vars, callback) {
  const binaryBuffer = Buffer.from(hashString, 'hex')
  imageSql
    .find({ hash: binaryBuffer })
    .then((res) => {
      callback(vars, res)
    })
    .catch(() => {
      callback(vars, [])
    })
}

function save(req, res) {
  if (req.query.type != undefined) {
    if (req.query.type === 'article') {
      identities.identityCheck(req, res, async (req, res, st) => {
        if (st.status != 0) {
          res.json({
            status: 1,
            data: 'failed'
          })
        } else {
          if (req.body._id === '') {
            const newVal = new articleSql({
              title: req.body.title,
              body: req.body.body,
              release: new Date(),
              modify: req.body.modify,
              tags: req.body.tags,
              cover: req.body.cover
            })
            newVal.save().then((st) => {
              Tags.tagsAddId(req.body.tags, st._id.toString())
              ExtAtc.AddNewA(
                st._id.toString(),
                req.body.desc,
                req.body.background,
                req.body.hidden,
                () => {}
              )
              res.json({
                status: 0,
                data: st._id.toString()
              })
            })
            return
          }
          articleSql.find({ _id: req.body._id }).then(async (st) => {
            if (st.length === 0) {
              res.json({
                status: 1,
                data: 'failed'
              })
            } else {
              Tags.tagsUpdateId(st[0].tags, req.body.tags, req.body._id)
              const update = {
                title: req.body.title,
                body: req.body.body,
                modify: new Date(),
                tags: req.body.tags,
                cover: req.body.cover
              }
              try {
                const result = await articleSql
                  .updateOne({ _id: req.body._id }, update)
                  .catch((e) => {
                    console.log(e)
                  })
                ExtAtc.updateNewA(
                  req.body._id,
                  req.body.desc,
                  req.body.background,
                  req.body.hidden,
                  () => {}
                )
                if (result.acknowledged) {
                  res.json({
                    status: 0,
                    data: 'success'
                  })
                } else {
                  res.json({
                    status: 1,
                    data: 'failed'
                  })
                }
              } catch (e) {
                res.json({
                  status: -1,
                  data: 'failed'
                })
              }
            }
          })
        }
      })
    } else if (req.query.type === 'image') {
      identities.identityCheck(req, res, async (req, res, st) => {
        if (st.status != 0 || req.file === undefined) {
          res.json({ status: 1, data: 'failed' })
        } else {
          const hash = crypto.createHash('sha256')
          hash.update(req.file.buffer)
          const hashHex = hash.digest()
          checkHash(hashHex.toString('hex'), { req, res, hashHex }, (vars, data) => {
            switch (data.length) {
              case 0:
                {
                  const newImage = new imageSql({
                    name: req.file.originalname,
                    type: req.file.mimetype,
                    encoding: req.file.encoding,
                    size: req.file.size,
                    hash: vars.hashHex,
                    buffer: req.file.buffer
                  })
                  newImage.save()
                  res.json({
                    status: 0,
                    data: vars.hashHex.toString('hex')
                  })
                }
                break
              case 1:
                {
                  if (data[0].size === req.file.size) {
                    res.json({
                      status: 0,
                      data: vars.hashHex.toString('hex')
                    })
                  } else vars.res.json({ status: 2, data: 'conflict' })
                }
                break
              case -1:
              default:
                vars.res.json({
                  status: -1,
                  data: 'failed'
                })
            }
          })
        }
      })
    }
  } else {
    res.json({
      status: -1,
      data: 'type not specified'
    })
  }
}

function getImage(req, res) {
  if (req.query.hash === undefined) {
    res.status(404).send('')
  } else {
    checkHash(req.query.hash, { req, res }, (vars, data) => {
      if (data.length === 0) {
        res.status(404).send('')
      } else {
        res.setHeader('Content-Type', 'image/jpeg')
        res.status(200).send(data[0].buffer)
      }
    })
  }
}

export default { save, upload, getImage }
