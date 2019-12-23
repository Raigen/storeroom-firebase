import * as firebase from '@firebase/testing'
import * as fs from 'fs'

jest.unmock('firebase')

const projectId = 'test-project'
const rules = fs.readFileSync('firestore.rules', 'utf8')

const getAdminApp = () => firebase.initializeAdminApp({ projectId }).firestore()
const getApp = (auth?: object) => firebase.initializeTestApp({ auth, projectId }).firestore()

beforeAll(async () => await firebase.loadFirestoreRules({ projectId, rules }))
beforeEach(async () => await firebase.clearFirestoreData({ projectId }))
afterAll(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()))
  console.log(`http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`)
})

describe('goods', function() {
  it('only signed in users can access the goods', async function() {
    const db = getApp()
    const doc = db.collection('goods').doc('123')
    await firebase.assertFails(doc.get())
  })

  it('only signed in users can access the goods', async function() {
    const db = getApp({ uid: '123' })
    const doc = db.collection('goods').doc('123')
    await firebase.assertSucceeds(doc.get())
  })

  it('normal users can not update and delete goods', async function() {
    const adminDb = getAdminApp()
    await adminDb
      .collection('users')
      .doc('456')
      .set({ admin: false, name: 'Test 1' })
    await adminDb
      .collection('goods')
      .doc('1')
      .set({ name: 'Suggar' })

    const db = getApp({ uid: '456' })
    const doc = db.collection('goods').doc('1')
    await firebase.assertFails(doc.update({ name: 'Sugar' }))
    await firebase.assertFails(doc.delete())
  })
  it('admin users can update and delete goods', async function() {
    const adminDb = getAdminApp()
    await adminDb
      .collection('users')
      .doc('123')
      .set({ admin: true, name: 'Test 1' })
    await adminDb
      .collection('goods')
      .doc('1')
      .set({ name: 'Suggar' })

    const db = getApp({ uid: '123' })
    const doc = db.collection('goods').doc('1')
    await firebase.assertSucceeds(doc.update({ name: 'Sugar' }))
    await firebase.assertSucceeds(doc.delete())
  })
})

describe('invites', function() {
  it('signed in users can access and create invites', async function() {
    const db = getApp({ uid: '123' })
    const doc = db.collection('invites').doc('1')
    await firebase.assertSucceeds(doc.set({ email: 'test@domain.com' }))
    await firebase.assertSucceeds(doc.get())
  })
})

describe('households', function() {
  it('signed in users can create and access a new household and rooms', async function() {
    const db = getApp({ uid: '123' })
    const doc = db.collection('households').doc('1')
    await firebase.assertSucceeds(
      doc.set({
        name: 'Home',
        owner: '123',
        users: ['123', '456'],
        rooms: [{ name: 'Kitchen' }]
      })
    )
    await firebase.assertSucceeds(doc.get())

    const room = doc.collection('rooms').doc('1')
    await firebase.assertSucceeds(room.set({ name: 'Kitchen' }))
    await firebase.assertSucceeds(room.get())
  })

  it('signed in user can access allowed households and rooms', async function() {
    const setupApp = getApp({ uid: '123' })
      .collection('households')
      .doc('1')
    await setupApp.set({ name: 'Home', owner: '123', users: ['123', '456'] })
    await setupApp
      .collection('rooms')
      .doc('1')
      .set({ name: 'Kitchen' })

    const db = getApp({ uid: '456' })
    const doc = db.collection('households').doc('1')
    await firebase.assertSucceeds(doc.get())

    const room = doc.collection('rooms').doc('1')
    await firebase.assertSucceeds(room.get())
  })

  it('signed in user can not access not allowed households or rooms', async function() {
    const setupApp = getApp({ uid: '123' })
      .collection('households')
      .doc('1')
    await setupApp.set({ name: 'Home', owner: '123', users: ['123', '456'] })
    await setupApp
      .collection('rooms')
      .doc('1')
      .set({ name: 'Kitchen' })

    const db = getApp({ uid: '789' })
    const doc = db.collection('households').doc('1')
    await firebase.assertFails(doc.get())

    const room = doc.collection('rooms').doc('1')
    await firebase.assertFails(room.get())
  })
})

describe('users', function() {
  it('signed in user can create own normal user', async function() {
    const db = getApp({ uid: '123' })

    const doc = db.collection('users').doc('123')
    await firebase.assertSucceeds(doc.set({ admin: false, name: 'Test' }))
    await firebase.assertSucceeds(doc.get())
  })
  it('signed in user can not create admin user', async function() {
    const db = getApp({ uid: '123' })

    const doc = db.collection('users').doc('123')
    await firebase.assertFails(doc.set({ admin: true, name: 'Test' }))
  })

  it('signed in user can update own user data', async function() {
    const db = getApp({ uid: '123' })
    const doc = db.collection('users').doc('123')
    await doc.set({ admin: false, name: 'Test' })

    await firebase.assertSucceeds(doc.update({ name: 'Test2', grantedUsers: ['456'] }))
  })
  it('signed in user can not set admin to true', async function() {
    const db = getApp({ uid: '123' })
    const doc = db.collection('users').doc('123')
    await doc.set({ admin: false, name: 'Test' })

    await firebase.assertFails(doc.update({ admin: true }))
  })

  it('signed in user can access granted user data', async function() {
    const setupApp = getApp({ uid: '123' })
      .collection('users')
      .doc('123')
    await setupApp.set({ name: 'Test 1', admin: false, grantedUsers: ['456'] })

    const db = getApp({ uid: '456' })
    const doc = db.collection('users').doc('123')

    await firebase.assertSucceeds(doc.get())
  })
  it('signed in user can not access any user data', async function() {
    const setupApp = getApp({ uid: '123' })
      .collection('users')
      .doc('123')
    await setupApp.set({ name: 'Test 1', admin: false, grantedUsers: ['456'] })

    const db = getApp({ uid: '789' })
    const doc = db.collection('users').doc('123')

    await firebase.assertFails(doc.get())
  })
})
