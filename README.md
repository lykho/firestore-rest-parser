# firestore-rest-parser

Parse and use [Firestore REST API JSON](https://firebase.google.com/docs/firestore/reference/rest/) as a pure js object ✨

Or convert js object to Firestore REST structure.

Turn this:
```json
{
  "data": {
    "mapValue": {
      "fields": {
        "username": {
          "stringValue": "user"
        },
        "isAdmin": {
          "booleanValue": true
        }
      }
    }
  }
}
```

Into this:

```json
{
  "data": {
    "username": "user",
    "isAdmin": true
  }
}
```

Or vice versa.

## Features

- Parse Firestore REST structure into js object
- Convert js object to Firestore REST compatible structure with type conversion
- Create full Firestore REST response structure

## Installing

Using npm:

`npm install firestore-rest-parser`

Using yarn:

`yarn add firestore-rest-parser`

## Example

```javascript
import { parse } from 'firestore-rest-parser'

const obj = {
  name: 'resouce/name',
  fields: {
    permissions: {
      arrayValue: {
        values: [{ stringValue: 'createUsers' }],
      },
    },
    contacts: {
      mapValue: {
        email: {
          prop: {
            stringValue: 'example@mail.com'
          },
        },
      },
    },
    unreadMessages: {
        integerValue: 5
    }
  },
  createTime: '',
  updateTime: '',
}

const data = parse(obj)

/*
  console.log(data) => {
    permissions: ['createUsers'],
    contacts: { email: 'example@mail.com' },
    unreadMessages: 5
  }
*/
```

## Usage

### Parse

To parse Firestore REST structure use `parse` function.

```typescript
import { parse } from 'firestore-rest-parser'

const firestoreObject = {
    fields: {
        prop: { integerValue: 1 }
    }
}

const data = parse(firestoreObject)

/*
  console.log(data) => {
    prop: 1
  }
 */
```

### Convert

To convert js object to Firestore REST structure use `convert` function.

**Note**
> Timestamp, Reference, Bytes, GeoPoint data types must be instances of type helper classes

```typescript
import { convert } from 'firestore-rest-parser'

const data = {
  username: 'user',
  permissions: ['createUsers']
}

const res = convert(data)

/*
  console.log(res) => {
    username: {
      stringValue: 'user'
    },
    permissions: {
      arrayValue: {
        values: [
          { stringValue: 'createUsers' }
        ]
      }
    }
  }
 */
```

#### Type helpers

To store `Date` or `timestamp` value use `Timestamp` helper. Provided time will be converted to ISO format.
```typescript
import { convert, Timestamp } from 'firestore-rest-parser'

const data = {
  date: new Timestamp(new Date()),
  timestamp: new Timestamp(1641727129175)
}

convert(data)
```

To store `Buffer` value use `Bytes` helper. Provided buffer will be converted to base64 string.
```typescript
import { convert, Bytes } from 'firestore-rest-parser'

const data = {
  buff: new Bytes(Buffer.from('value'))
}

convert(data)
```

To store `Reference` (path to element in db) value use `Reference` helper.
```typescript
import { convert, Reference } from 'firestore-rest-parser'

const data = {
  prop: new Reference('path/to/doc')
}

convert(data)
```

To store `GeoPoint` value use `GeoPoint` helper.
```typescript
import { convert, GeoPoint } from 'firestore-rest-parser'

const data = {
  prop: new GeoPoint(0, 0)
}

convert(data)
```

#### Firestore REST object

`convert` function creates only part (`fields`) of the Firestore Rest object. To create full structure
(with `name`, `createTime`, `updateTime`) use `createRESTObject` function.

```typescript
import { convert, createRESTObject } from 'firestore-rest-parser'

const data = {
  username: 'user',
  permissions: ['createUsers']
}

const res = createRESTObject(convert(data), 'users/userId')

/* console.log(res) => {
     fields: { /.../ }
     name: 'users/userId',
     createTime: '',
     updateTime: ''
*/ }
```

#### Firestore type conversion

| Javascript Type         | Firestore Type | Type helper required |
|-------------------------|----------------|----------------------|
| Null                    | Null           |                      |
| Boolean                 | Boolean        |                      |
| Number (int)            | Integer        |                      |
| Number (float)          | Double         |                      |
| Date or UTC timestamp   | Timestamp      | +                    |
| String                  | String         |                      |
| Buffer (base64 string)  | Bytes          | +                    |
| Reference (string path) | Reference      | +                    |
| GeoPoint                | GeoPoint       | +                    |
| Array                   | Array          |                      |
| Object                  | Map            |                      |
