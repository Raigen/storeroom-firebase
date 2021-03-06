import 'firebase/auth'

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
export const collectionWhere = jest
  .fn()
  .mockName('where')
  .mockReturnValue({ add: collectionAdd, doc })

export const collection = jest
  .fn()
  .mockName('collection')
  .mockReturnValue({ add: collectionAdd, doc, where: collectionWhere })

export const collectionGroup = jest.fn().mockName('collectionGroup')

export const firestore = {
  collection,
  collectionGroup,
  doc
}

export const analytics = {
  logEvent: jest.fn().mockName('logEvent'),
  setUserId: jest.fn().mockName('setUserId'),
  setCurrentScreen: jest.fn().mockName('setCurrentScreen'),
  setAnalyticsCollectionEnabled: jest.fn().mockName('setAnalyticsCollectionEnabled')
}

export const acceptInvite = jest.fn().mockName('acceptInvite')
export const functions = {
  httpsCallable: () => acceptInvite
}
