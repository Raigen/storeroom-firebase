const docUpdate = jest
  .fn()
  .mockName('docUpdate')
  .mockImplementation(() => null)
const docDelete = jest
  .fn()
  .mockName('delete')
  .mockImplementation(() => null)
export const doc = jest
  .fn()
  .mockName('doc')
  .mockReturnValue({ update: docUpdate, delete: docDelete })

export const collectionAdd = jest
  .fn()
  .mockName('collectionAdd')
  .mockImplementation(() => null)

export const collection = jest
  .fn()
  .mockName('collection')
  .mockReturnValue({ add: collectionAdd, doc })

export const firestore = {
  collection,
  doc
}
