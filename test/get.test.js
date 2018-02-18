'use strict'

const test = require('tap').test
const AWS = require('aws-sdk')
const clientFactory = require('../')
const endpoint = new AWS.Endpoint('http://127.0.0.1:8000')

test('can retrieve items', (t) => {
  t.plan(1)
  const client = clientFactory({
    region: 'none',
    credentials: {
      accessKeyId: '123456',
      secretAccessKey: '123456'
    },
    otherOptions: {endpoint}
  })
  client.get('Movies', {year: 2013, title: 'Rush'})
    .then((result) => {
      t.strictDeepEqual(result, {
        Item: {
          year: 2013,
          title: 'Rush'
        }
      })
    })
    .catch(t.threw)
})
