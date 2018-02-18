'use strict'

const test = require('tap').test
const AWS = require('aws-sdk')
const clientFactory = require('../')
const endpoint = new AWS.Endpoint('http://127.0.0.1:8000')

test('can put items', (t) => {
  t.plan(1)

  const client = clientFactory({
    region: 'none',
    credentials: {
      accessKeyId: '123456',
      secretAccessKey: '123456'
    },
    otherOptions: {endpoint}
  })
  const year = (new Date()).getFullYear()
  const item = {
    year,
    title: 'foo'
  }

  client.put('Movies', item)
    .then(() => client.get('Movies', {title: 'foo', year}))
    .then((_item) => {
      t.strictDeepEqual(item, _item.Item)
    })
    .catch(t.threw)
})

test('fails for bad payload', (t) => {
  t.plan(2)

  const client = clientFactory({
    region: 'none',
    credentials: {
      accessKeyId: '123456',
      secretAccessKey: '123456'
    },
    otherOptions: {endpoint}
  })
  client.put('Movies', {title: 'foo'})
    .then(() => t.fail('should not happen'))
    .catch((err) => {
      t.type(err, Error)
      t.match(err, /required keys/)
    })
})
