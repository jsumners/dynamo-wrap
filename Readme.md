# dynamo-wrap
[![Build Status](https://travis-ci.org/jsumners/dynamo-wrap.svg?branch=master)](https://travis-ci.org/jsumners/dynamo-wrap)

This is a simple wrapper around the [`aws-sdk`][awssdk] to facilitate
working with DynamoDB instances.

[awssdk]: https://npm.im/aws-sdk

<a id="example"></a>
## Example

```js
const dynamoWrap = require('@jsumners/dynamo-wrap')
const db = dynamoWrap({
  region: 'us-east-1',
  credentials: {
    accessKeyId: '1234',
    secreteAccessKey: '5678'
  }
})

const item = {
  title: 'Foo',
  author: 'Foo Bar'
}
db.put('books', item)
  .then((result) => {
    console.log('item added: ', result)
  })
  .catch((err) => {
    console.error('item could not be added: ', err)
  })

const key = {
  title: {S: 'Foo'},
  author: {S: 'Foo Bar'}
}
db.get('books', key)
  .then((item) => {
    console.log('item: %j', item)
  })
  .catch((err) => {
    console.error('could not lookup item: ', err)
  })
```

<a id="api"></a>
## API

<a id="factory"></a>
### Factory
The `dynamo-wrap` module returns a factory function which will return a client
instance that is configured to work with a specific DynamoDB instance. The
function accepts an options object with the following properties:

+ `apiVersion`: The supported API version of the target database. Default:
`'2012-08-10'`.
+ `region` (required): The target AWS region for the database.
+ `credentials` (required): An AWS credentials object.
+ `optionOptions`: An object specifying additional options to be supplied to
the `AWS.DynamodDB` constructor. Default: `{}`.

<a id="get"></a>
#### `.get(table, key, otherParams)`
Retrieves an item from the database and returns a `Promise` for resolution.

+ `table` (string): The name of the table to query for the item.
+ `key` (object): The key for the desired item.
+ `otherParams` (object): A hash of extra parameters to supply when querying
for the item. See the [the documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html)
for a list of supported parameters.

<a id="put"></a>
#### `.put(table, item, otherParams)`
Inserts an item into the database and returns a `Promise` for resolution.

+ `table` (string): The name of the table to insert the item into.
+ `item` (object): The item to insert.
+ `otherParams` (object): A hash of extra parameters to supply when inserting
the item. See [the documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html)
for a list of supported parameters.

<a id="license"></a>
## License
[MIT License](http://jsumners.mit-license.org/)
