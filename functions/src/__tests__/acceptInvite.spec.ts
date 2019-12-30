import * as functions from 'firebase-functions-test'
import * as requests from '../index'

const test = functions()

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: () => ({
    collection: mockCollection
  })
}))

const invite = { email: '', household: '1', ownerId: '1', used: false }
const household = { name: 'Test', owner: '1', users: ['1'] }
const user = { admin: false, email: 'test@domain.de', name: 'Test', grantedUsers: ['123'] }

const inviteRef = { update: jest.fn().mockName('inviteUpdate') }
const householdRef = { update: jest.fn().mockName('householdUpdate') }
const userRef = { update: jest.fn().mockName('userUpdate') }

const documentGet = (snapshot?: any) => ({ doc: () => ({ get: async () => snapshot }) })
const getSnap = (obj: any) => ({ get: (prop: string) => obj[prop] })

const mockCollection = (path: string) => {
  switch (path) {
    case '/invites':
      return documentGet({ ...getSnap(invite), ref: inviteRef })
    case '/households':
      return documentGet({ ...getSnap(household), ref: householdRef })
    case '/users':
      return documentGet({ ...getSnap(user), ref: userRef })
    default:
      throw new Error(`${path} not implemented`)
  }
}

it('update invite, household and user when accepting invites', async function() {
  const acceptInvite = test.wrap(requests.acceptInvite)
  await acceptInvite({ inviteId: '1', uid: '2' }, { auth: { uid: '2' } })

  expect(inviteRef.update).toBeCalledWith({ used: true })
  expect(householdRef.update).toBeCalledWith({ users: ['1', '2'] })
  expect(userRef.update).toBeCalledWith({ grantedUsers: ['123', '1'] })
})

it('do not accept without authentication', async function() {
  const acceptInvite = test.wrap(requests.acceptInvite)
  await expect(acceptInvite({})).rejects.toThrowError('Not authenticated')
})
