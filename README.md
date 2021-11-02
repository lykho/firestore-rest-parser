# firestore-rest-parser

[![npm version](https://badge.fury.io/js/firestore-rest-parser.svg)](https://badge.fury.io/js/firestore-rest-parser)

Parse and use [Firestore REST API JSON](https://firebase.google.com/docs/firestore/reference/rest/) as a nice pretty object ✨

Turn this:
```json
{
  "suchWowObject": {
    "mapValue": {
      "fields": {
        "someAwesomeField": {
          "stringValue": "Hooray"
        },
        "isItCool": {
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
  "suchWowObject": {
    "someAwesomeField": "Hooray",
    "isItCool": true
  }
}
```

## Installing

Using npm:

`npm install firestore-rest-parser`

Using yarn:

`yarn add firestore-rest-parser`

## Example

```javascript
import { parse } from 'firestore-rest-parser'

const somehowReceivedFirestoreJSON = {
  name: 'resouce/name',
  fields: {
    fieldOne: {
      arrayValue: {
        values: [{ stringValue: 'Hellow' }],
      },
    },
    fieldTwo: {
      mapValue: {
        fields: {
          world: {
            stringValue: 'hi',
          },
        },
      },
    },
    fieldThree: {
        stringValue: 'HopHey'
    }
  },
  createTime: '',
  updateTime: '',
}

const data = parse(somehowReceivedFirestoreJSON)

/*
  console.log(data) => {
    fieldOne: ['Hellow'],
    fieldTwo: { world: 'hi' },
    fieldThree: 'HopHey'
  }
 */
```

## Usage

```typescript
import { parse } from 'firestore-rest-parser'

interface ParsedData {}

const data = parse<ParsedData>(somehowReceivedFirestoreJSON)
```
