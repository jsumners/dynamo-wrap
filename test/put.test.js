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

test.cb('can put items', (t) => {
  t.plan(1)

  const year = (new Date()).getFullYear()
  const item = {
    year,
    title: 'foo'
  }

  client.put('Movies', item)
    .then(() => client.get('Movies', {title: 'foo', year}))
    .then((_item) => {
      t.deepEqual(item, _item)
      t.end()
    })
    .catch(t.fail)
})

test.cb('can put items with callback', (t) => {
  t.plan(4)

  const year = (new Date()).getFullYear()
  const item = {
    year,
    title: 'foo'
  }

  client.put('Movies', item, (err, data) => {
    t.is(err, null)
    t.deepEqual(data, {})
    client.get('Movies', item, (err, _item) => {
      t.is(err, null)
      t.deepEqual(item, _item)
      t.end()
    })
  })
})

test.cb('fails for bad payload', (t) => {
  t.plan(2)

  client.put('Movies', {title: 'foo'})
    .then(() => t.fail('should not happen'))
    .catch((err) => {
      t.true(Error.prototype.isPrototypeOf(err))
      t.true(/required keys/.test(err.message))
      t.end()
    })
})

test.cb('rejects for missing parameters', (t) => {
  t.plan(2)
  client.put('Movies')
    .then(() => t.fail('should not happen'))
    .catch((err) => {
      t.true(Error.prototype.isPrototypeOf(err))
      t.is(err.message, 'Missing required table name or item parameters.')
      t.end()
    })
})

test.cb('rejects for missing paramters via callback', (t) => {
  t.plan(3)
  client.put('Movies', (err, data) => {
    t.is(data, undefined)
    t.true(Error.prototype.isPrototypeOf(err))
    t.is(err.message, 'Missing required table name or item parameters.')
    t.end()
  })
})

test.cb('rejects for missing paramters when only callback supplied', (t) => {
  t.plan(3)
  client.put((err, data) => {
    t.is(data, undefined)
    t.true(Error.prototype.isPrototypeOf(err))
    t.is(err.message, 'Missing required table name or item parameters.')
    t.end()
  })
})

test.cb('can put documents with extra properties', (t) => {
  t.plan(4)
  const item = {
    year: 2018,
    title: 'extra-properties',
    foo: 'foo',
    bar: {
      baz: 'qux'
    }
  }
  client.put('Movies', item, (err, data) => {
    t.is(err, null)
    t.deepEqual(data, {})
    const key = {
      year: 2018,
      title: 'extra-properties'
    }
    client.get('Movies', key, (err, _item) => {
      t.is(err, null)
      t.deepEqual(_item, item)
      t.end()
    })
  })
})
