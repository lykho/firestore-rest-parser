import { FirestoreResponseObjectField } from './types'

export function createRESTObject(
  fields: FirestoreResponseObjectField | null,
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
