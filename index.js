'use strict'

const AWS = require('aws-sdk')
const dbKey = Symbol.for('dynamo-wrap.db.key')

const clientProto = {
  get (table, key, otherParams = {}) {
    function promise (resolve, reject) {
      if (!table) return reject(Error('Must specify table name.'))
      if (!key) return reject(Error('Must specify key object.'))
      const query = Object.assign({}, otherParams, {
        Key: key,
        TableName: table
      })
      this[dbKey].get(query, (err, data) => {
        if (err) return reject(err)
        return resolve(data)
      })
    }

    return new Promise(promise.bind(this))
  },

  put (table, item, otherParams = {}) {
    function promise (resolve, reject) {
      if (!table) return reject(Error('Must specify table name.'))
      if (!item) return reject(Error('Must supply an item'))
      const payload = Object.assign({}, otherParams, {
        Item: item,
        TableName: table
      })
      this[dbKey].put(payload, (err, data) => {
        if (err) return reject(err)
        return resolve(data)
      })
    }

    return new Promise(promise.bind(this))
  }
}

module.exports = function ({apiVersion = '2012-08-10', region, credentials, otherOptions = {}}) {
  if (!region) throw Error('Must specify AWS region.')
  if (!credentials) throw Error('Must supply AWS credentials object.')
  const client = Object.create(clientProto)
  const options = Object.assign({}, otherOptions, {
    apiVersion,
    region,
    credentials
  })
  const db = new AWS.DynamoDB.DocumentClient(options)
  client[dbKey] = db
  return client
}
