# firestore-rest-parser

[![npm version](https://badge.fury.io/js/firestore-rest-parser.svg)](https://badge.fury.io/js/firestore-rest-parser)

Parse [Firestore REST API JSON](https://firebase.google.com/docs/firestore/reference/rest/)
into plain JavaScript objects, or convert JavaScript objects back into
Firestore REST structure.

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

- Parse Firestore REST structure into plain JavaScript objects
- Convert JavaScript objects to Firestore REST compatible structure
- Create full Firestore REST response structure
- Preserve unsafe Firestore integers by default
- Throw path-aware errors for malformed input
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
      integerValue: '5'
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

Use `parse` to turn Firestore REST fields into plain JavaScript values.

```typescript
import { parse } from 'firestore-rest-parser'

const firestoreObject = {
  name: 'projects/my-project/databases/(default)/documents/collection/doc',
  fields: {
    prop: { integerValue: '1' }
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

#### Integer parsing

By default, `parse` uses `integerMode: 'smart'`:

- Safe integers are returned as `number`
- Unsafe integers are preserved as `string`

```typescript
const doc = createRESTObject({
  small: { integerValue: '42' },
  large: { integerValue: '9007199254740993' }
})

parse(doc)
// => { small: 42, large: '9007199254740993' }
```

You can override this behavior when needed:

```typescript
parse(doc, { integerMode: 'number' })
parse(doc, { integerMode: 'string' })
parse(doc, { integerMode: 'bigint' })
```

### Convert

Use `convert` to wrap plain JavaScript values in Firestore's typed REST format.

**Note**
> `Timestamp`, `Reference`, `Bytes`, and `GeoPoint` values must be instances of
> the provided helper classes.

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

Use `Timestamp` for `Date` objects or millisecond timestamps. Invalid values
throw immediately.
```typescript
import { convert, Timestamp } from 'firestore-rest-parser'

const data = {
  date: new Timestamp(new Date()),
  timestamp: new Timestamp(1641727129175)
}

convert(data)
// Both become: { timestampValue: "2022-01-09T12:58:49.175Z" }
```

Use `Bytes` for `Uint8Array`, `ArrayBuffer`, or Node.js `Buffer` values. The
input is converted to a base64 string.
```typescript
import { convert, Bytes } from 'firestore-rest-parser'

const data = {
  buff: new Bytes(new TextEncoder().encode('value'))
}

convert(data)
```

Use `Reference` for Firestore document paths.
```typescript
import { convert, Reference } from 'firestore-rest-parser'

const data = {
  author: new Reference('projects/my-project/databases/(default)/documents/users/123')
}

convert(data)
```

Use `GeoPoint` for latitude/longitude pairs. Invalid coordinates throw
immediately.
```typescript
import { convert, GeoPoint } from 'firestore-rest-parser'

const data = {
  location: new GeoPoint(40.7128, -74.0060)
}

convert(data)
```

#### Firestore REST object

`convert` creates only the `fields` section of a Firestore REST object. To create the full structure
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
parse(
  createRESTObject({
    items: { arrayValue: {} }
  })
)
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

`parse` and `convert` both throw descriptive, path-aware errors for malformed
input:

```typescript
convert({ profile: { age: undefined } })
// => Unsupported Firestore value at "profile.age": received undefined

parse(
  createRESTObject({
    id: {
      integerValue: '42.5'
    }
  })
)
// => Invalid Firestore integer at "id": expected an integer string, received "42.5"
```

## Firestore type conversion

| JavaScript Type        | Firestore Type | Type helper required |
|-------------------------|----------------|----------------------|
| Null                    | Null           |                      |
| Boolean                 | Boolean        |                      |
| Number (int)            | Integer        |                      |
| Number (float)          | Double         |                      |
| Date or UTC timestamp   | Timestamp      | +                    |
| String                  | String         |                      |
| Binary data             | Bytes          | +                    |
| Reference (string path) | Reference      | +                    |
| GeoPoint                | GeoPoint       | +                    |
| Array                   | Array          |                      |
| Object                  | Map            |                      |

## API Reference

| Export | Description |
|--------|-------------|
| `parse<T>(response, options?)` | Parses Firestore REST response to plain JavaScript values |
| `convert(data)` | Converts plain JS object to Firestore REST format |
| `createRESTObject(fields, name?, createTime?, updateTime?)` | Creates full Firestore document structure |
| `Timestamp` | Helper class for timestamp values |
| `Bytes` | Helper class for binary data |
| `Reference` | Helper class for document references |
| `GeoPoint` | Helper class for geographic coordinates |

## License

MIT
