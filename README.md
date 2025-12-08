# firestore-rest-parser

[![npm version](https://badge.fury.io/js/firestore-rest-parser.svg)](https://badge.fury.io/js/firestore-rest-parser)

Parse and use [Firestore REST API JSON](https://firebase.google.com/docs/firestore/reference/rest/) as a pure js object.

Or convert js object to Firestore REST structure.

**Zero dependencies** - lightweight and fast.

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
- Full TypeScript support with generics
- Zero runtime dependencies

## Installing

Using npm:

`npm install firestore-rest-parser`

Using yarn:

`yarn add firestore-rest-parser`

## Example

```typescript
import { parse } from 'firestore-rest-parser'

const obj = {
  name: 'projects/my-project/databases/(default)/documents/users/123',
  fields: {
    permissions: {
      arrayValue: {
        values: [{ stringValue: 'createUsers' }],
      },
    },
    contacts: {
      mapValue: {
        fields: {
          email: {
            stringValue: 'example@mail.com'
          },
        },
      },
    },
    unreadMessages: {
      integerValue: 5
    }
  },
  createTime: '2024-01-15T12:00:00Z',
  updateTime: '2024-01-15T12:00:00Z',
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
  name: 'projects/my-project/databases/(default)/documents/collection/doc',
  fields: {
    prop: { integerValue: 1 }
  },
  createTime: '2024-01-15T12:00:00Z',
  updateTime: '2024-01-15T12:00:00Z',
}

const data = parse(firestoreObject)

/*
  console.log(data) => {
    prop: 1
  }
*/
```

#### TypeScript Generics

You can use TypeScript generics to type the parsed result:

```typescript
interface User {
  name: string
  age: number
  active: boolean
}

const user = parse<User>(firestoreResponse)
// user is typed as User | null
```

**Note:** The generic type is a compile-time assertion only and is not validated at runtime.

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
// Both will produce: { timestampValue: "2022-01-09T12:58:49.175Z" }
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
  author: new Reference('projects/my-project/databases/(default)/documents/users/123')
}

convert(data)
```

To store `GeoPoint` value use `GeoPoint` helper.
```typescript
import { convert, GeoPoint } from 'firestore-rest-parser'

const data = {
  location: new GeoPoint(40.7128, -74.0060)
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

const res = createRESTObject(
  convert(data),
  'projects/my-project/databases/(default)/documents/users/userId',
  '2024-01-15T12:00:00Z',
  '2024-01-15T12:00:00Z'
)

/*
  console.log(res) => {
    name: 'projects/my-project/databases/(default)/documents/users/userId',
    fields: { ... },
    createTime: '2024-01-15T12:00:00Z',
    updateTime: '2024-01-15T12:00:00Z'
  }
*/
```

### Edge Cases

#### Empty arrays
```typescript
// Parsing empty arrays
parse({ fields: { items: { arrayValue: {} } } })
// => { items: [] }

// Converting empty arrays
convert({ items: [] })
// => { items: { arrayValue: { values: [] } } }
```

#### Null fields
```typescript
// Documents with null fields return null
const doc = createRESTObject(null)
parse(doc) // => null
```

### Error Handling

The `convert` function throws an error for unsupported data types:

```typescript
// These will throw "Unprocessable data type" error:
convert({ fn: () => {} })      // Functions
convert({ sym: Symbol() })     // Symbols
convert({ undef: undefined })  // undefined
```

## Firestore type conversion

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

## API Reference

| Export | Description |
|--------|-------------|
| `parse<T>(response)` | Parses Firestore REST response to plain JS object |
| `convert(data)` | Converts plain JS object to Firestore REST format |
| `createRESTObject(fields, name?, createTime?, updateTime?)` | Creates full Firestore document structure |
| `Timestamp` | Helper class for timestamp values |
| `Bytes` | Helper class for binary data |
| `Reference` | Helper class for document references |
| `GeoPoint` | Helper class for geographic coordinates |

## License

MIT
