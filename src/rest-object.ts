import { FirestoreResponseObjectField } from './types'

export function createRESTObject(
  fields: FirestoreResponseObjectField,
  name = '',
  createTime = '',
  updateTime = ''
) {
  return {
    name,
    fields,
    createTime,
    updateTime,
  }
}
