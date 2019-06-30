export const collectionAdd = jest
  .fn()
  .mockName('collectionAdd')
  .mockImplementation(args => console.log({ args }))

export const collection = jest
  .fn()
  .mockName('collection')
  .mockReturnValue({ add: collectionAdd })

export const firestore = {
  collection
}
