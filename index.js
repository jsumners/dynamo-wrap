'use strict'

const AWS = require('aws-sdk')
const merge = require('lodash.merge')
const dbKey = Symbol.for('dynamo-wrap.db.key')

function getCallback (args) {
  const cb = (Function.prototype.isPrototypeOf(args.slice(-1).pop()))
    ? args.slice(-1).pop()
    : undefined
  return cb
}

const clientProto = {
  get (table, key, otherParams = {}) {
    let error
    if (!table || !key || Function.prototype.isPrototypeOf(key)) {
      error = Error('Missing required table name or key parameters.')
    }
    const cb = getCallback([].slice.call(arguments))
    const query = merge({}, otherParams, {
      Key: key,
      TableName: table
    })

    if (!cb && error) return Promise.reject(error)
    if (cb && error) return cb(error)
    const request = this[dbKey].get(query)
    if (!cb) return request.promise().then((data) => data.Item)
    request.send((err, data) => {
      if (err) return cb(err)
      cb(null, data.Item)
    })
  },

  put (table, item, otherParams = {}) {
    let error
    if (!table || !item || Function.prototype.isPrototypeOf(item)) {
      error = Error('Missing required table name or item parameters.')
    }
    const cb = getCallback([].slice.call(arguments))
    const payload = merge({}, otherParams, {
      Item: item,
      TableName: table
    })

    if (!cb && error) return Promise.reject(error)
    if (cb && error) return cb(error)
    const request = this[dbKey].put(payload)
    if (!cb) return request.promise()
    request.send(cb)
  }
}

module.exports = function ({apiVersion = '2012-08-10', region, credentials, otherOptions = {}}) {
  if (!region) throw Error('Must specify AWS region.')
  if (!credentials) throw Error('Must supply AWS credentials object.')
  const client = Object.create(clientProto)
  const options = merge({}, otherOptions, {
    apiVersion,
    region,
    credentials
  })
  const db = new AWS.DynamoDB.DocumentClient(options)
  client[dbKey] = db
  return client
}
