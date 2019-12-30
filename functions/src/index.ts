import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp(functions.config().firebase)

type AcceptInviteData = {
  uid: string
  inviteId: string
}

export const acceptInvite = functions.region('europe-west1').https.onCall(async (data: AcceptInviteData, context) => {
  if (!context.auth?.uid) throw new Error('Not authenticated')

  const db = admin.firestore()

  const inviteData = await db
    .collection('/invites')
    .doc(data.inviteId)
    .get()
  const household = await db
    .collection('/households')
    .doc(inviteData.get('household'))
    .get()
  const user = await db
    .collection('/users')
    .doc(data.uid)
    .get()

  await inviteData.ref.update({ used: true })
  await household.ref.update({ users: [...household.get('users'), data.uid] })
  await user.ref.update({ grantedUsers: [...user.get('grantedUsers'), household.get('owner')] })
})
