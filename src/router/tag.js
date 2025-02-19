import tagSql from '../express/schema/tag.js'

function tagsRemoveId(tags, id) {
  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i]
    tagSql.find({ name: tag }).then((res) => {
      if (res.length === 0) return
      let value = res[0].ids
      const index = value.indexOf(id)
      if (index === -1) return
      value.splice(index, 1)
      const update = {
        ids: value
      }
      tagSql.updateOne({ _id: res[0]._id }, update).catch(() => {})
    })
  }
}

function tagsAddId(tags, id) {
  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i]
    tagSql.find({ name: tag }).then((res) => {
      if (res.length === 0) {
        const newVal = new tagSql({
          name: tag,
          ids: [id]
        })
        newVal.save()
        return
      }
      let value = res[0].ids
      value.push(id)
      const update = {
        ids: value
      }
      tagSql.updateOne({ _id: res[0]._id }, update).catch(() => {})
    })
  }
}

function tagsUpdateId(oldTags, newTags, id) {
  let toRemove = []
  let toAdd = []
  for (let i = 0; i < newTags.length; i++) {
    if (!oldTags.includes(newTags[i])) toAdd.push(newTags[i])
  }
  for (let i = 0; i < oldTags.length; i++) {
    if (!newTags.includes(oldTags[i])) toRemove.push(oldTags[i])
  }
  tagsRemoveId(toRemove, id)
  tagsAddId(toAdd, id)
}

export default { tagsRemoveId, tagsAddId, tagsUpdateId }
