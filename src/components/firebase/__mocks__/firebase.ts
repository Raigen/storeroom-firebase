export const collectionAdd = jest
  .fn()
  .mockName('collectionAdd')
  .mockImplementation(() => null)

export const collection = jest
  .fn()
  .mockName('collection')
  .mockReturnValue({ add: collectionAdd })

const docUpdate = jest
  .fn()
  .mockName('docUpdate')
  .mockImplementation(() => null)
export const doc = jest
  .fn()
  .mockName('doc')
  .mockReturnValue({ update: docUpdate })

export const firestore = {
  collection,
  doc
}
