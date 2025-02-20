/**
 * Parse metadata at the top of the document
 */
showdown.subParser('metadata', function (text, options, globals) {
  'use strict'

  if (!options.metadata) {
    return text
  }

  text = globals.converter._dispatch('metadata.before', text, options, globals)

  function parseMetadataContents(content) {
    // raw is raw so it's not changed in any way
    globals.metadata.raw = content

    // escape chars forbidden in html attributes
    // double quotes
    content = content
      // ampersand first
      .replace(/&/g, '&amp;')
      // double quotes
      .replace(/"/g, '&quot;')

    content = content.replace(/\n {4}/g, ' ')
    content.replace(/^([\S ]+): +([\s\S]+?)$/gm, function (wm, key, value) {
      globals.metadata.parsed[key] = value
      return ''
    })
  }

  text = text.replace(/^\s*«««+(\S*?)\n([\s\S]+?)\n»»»+\n/, function (wholematch, format, content) {
    parseMetadataContents(content)
    return '¨M'
  })

  text = text.replace(/^\s*---+(\S*?)\n([\s\S]+?)\n---+\n/, function (wholematch, format, content) {
    if (format) {
      globals.metadata.format = format
    }
    parseMetadataContents(content)
    return '¨M'
  })

  text = text.replace(/¨M/g, '')

  text = globals.converter._dispatch('metadata.after', text, options, globals)
  return text
})
