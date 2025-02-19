import ArticleExtSql from '../express/schema/atc_extend.js'

const defaultNew = {
  view: 0,
  comments: 0
}

const defaultVal = {
  ...defaultNew,
  desc: '',
  background: 'null',
  hidden: false
}

function AddNew(id, callback) {
  const newVal = ArticleExtSql.articleExtSql.articleExtSql({
    ...defaultVal,
    id: id
  })
  newVal.save().then(callback)
}

function AddNewA(id, desc, background, hidden, callback) {
  const newVal = ArticleExtSql.articleExtSql({
    ...defaultNew,
    id: id,
    desc: desc,
    background: background,
    hidden: hidden
  })
  newVal.save().then(callback)
}

function updateNewA(id, desc, background, hidden, callback) {
  const update = {
    desc: desc,
    background: background,
    hidden: hidden
  }
  ArticleExtSql.articleExtSql.updateOne({ id: id }, update).then(callback)
}

function queryExist(id, callback) {
  ArticleExtSql.articleExtSql.find({ id: id }).then((st) => {
    if (st.length === 0) {
      AddNew(id, callback)
    } else {
      callback()
    }
  })
}

function articleViewAdd(id, callback) {
  queryExist(id, () => {
    ArticleExtSql.articleExtSql.find({ id: id }).then((st) => {
      const newView = st[0].view + 1
      ArticleExtSql.articleExtSql
        .updateOne(
          { id: id },
          {
            view: st[0].view + 1
          }
        )
        .then(() => {})
      callback(newView)
    })
  })
}

function remove(id) {
  ArticleExtSql.articleExtSql.findOneAndDelete({ id: id }).then(() => {})
}

export default { articleViewAdd, AddNewA, updateNewA, remove }
