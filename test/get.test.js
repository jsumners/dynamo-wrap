'use strict'

const test = require('ava').test
const AWS = require('aws-sdk')
const clientFactory = require('../')
const endpoint = new AWS.Endpoint('http://127.0.0.1:8000')
const client = clientFactory({
  region: 'none',
  credentials: {
    accessKeyId: '123456',
    secretAccessKey: '123456'
  },
  otherOptions: {endpoint}
})

test.cb('can retrieve items via promise', (t) => {
  t.plan(1)
  client.get('Movies', {year: 2013, title: 'Rush'})
    .then((result) => {
      t.deepEqual(result, {
        year: 2013,
        title: 'Rush'
      })
      t.end()
    })
    .catch(t.fail)
})

test.cb('can retrieve items via callback', (t) => {
  t.plan(2)
  client.get('Movies', {year: 2013, title: 'Rush'}, (err, item) => {
    t.is(err, null)
    t.deepEqual(item, {
      year: 2013,
      title: 'Rush'
    })
    t.end()
  })
})

test.cb('rejects if missing parameters', (t) => {
  t.plan(2)
  client.get('Movies')
    .then(() => t.fail('should not happen'))
    .catch((err) => {
      t.true(Error.prototype.isPrototypeOf(err))
      t.is(err.message, 'Missing required table name or key parameters.')
      t.end()
    })
})

test.cb('reject via callback if missing parameters', (t) => {
  t.plan(3)
  client.get('Movies', (err, item) => {
    t.true(Error.prototype.isPrototypeOf(err))
    t.is(err.message, 'Missing required table name or key parameters.')
    t.is(item, undefined)
    t.end()
  })
})

test.cb('reject via callback if only callback is supplied', (t) => {
  t.plan(3)
  client.get((err, item) => {
    t.true(Error.prototype.isPrototypeOf(err))
    t.is(err.message, 'Missing required table name or key parameters.')
    t.is(item, undefined)
    t.end()
  })
})
