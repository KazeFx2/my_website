import Identity from './identity.js'
import articleSql from '../express/schema/article.js'
import Tags from './tag.js'
import ExtAtc from './ext_atc.js'

function remove(req, res) {
  if (req.query.type !== undefined) {
    if (req.query.type === 'article') {
      if (req.query.id === undefined) {
        res.json({
          status: -1,
          data: 'failed'
        })
      } else {
        Identity.identityCheck(req, res, (req, res, st) => {
          if (st.status != 0) {
            res.json({
              status: 1,
              data: 'failed'
            })
          } else {
            try {
              articleSql
                .findOneAndDelete({ _id: req.query.id })
                .then((st) => {
                  Tags.tagsRemoveId(st.tags, req.query.id)
                  ExtAtc.remove(req.query.id)
                  res.json({
                    status: 0,
                    data: 'success'
                  })
                })
                .catch(() => {
                  res.json({
                    status: 2,
                    data: 'failed'
                  })
                })
            } catch (e) {
              res.json({
                status: 2,
                data: 'failed'
              })
            }
          }
        })
      }
    } else
      res.json({
        status: -1,
        data: 'failed'
      })
  } else {
    res.json({
      status: -1,
      data: 'failed'
    })
  }
}

export default remove
