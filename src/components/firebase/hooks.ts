import { analytics, auth, firestore } from './firebase'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'

import React from 'react'
import { RoomType } from '../rooms/Room'
import { SIGN_IN } from '../../constants/routes'
import { __RouterContext } from 'react-router'

type UserData = {
  admin: boolean
  name: string
  email: string
  picture: string
  grantedUsers: string[]
  activeHousehold?: string
}

export function useFirebaseUser(): { userData: UserData | null; user: firebase.User | null } {
  const router = React.useContext(__RouterContext)
  const [user, setUser] = React.useState<firebase.User | null>(null)

  const docRef = user ? firestore.doc(`users/${user.uid}`) : null
  const [userData = null, , error] = useDocumentData<UserData>(docRef)
  if (error) console.error('useFirebaseUser', error)
  React.useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      setUser(user)
      if (!user) {
        router.history.push(SIGN_IN)
      } else {
        analytics.setUserId(user.uid)
      }
    })
    return () => unregisterAuthObserver()
    // eslint-disable-next-line
  }, [])
  return { user, userData }
}

export type Household = {
  id: string
  users: String[]
}

export function useHousehold(): { household: Household | null; rooms: RoomType[] } {
  const { userData } = useFirebaseUser()

  const householdRef =
    userData && userData.activeHousehold ? firestore.doc(`households/${userData.activeHousehold}`) : null
  const [household = null, , error] = useDocumentData<Household>(householdRef, { idField: 'id' })

  if (error) console.error('useHousehold', error)

  const roomRef = household ? firestore.collection(`households/${household.id}/rooms`) : null
  const [rooms = []] = useCollectionData<RoomType>(roomRef, { idField: '_id' })
  return { household, rooms }
}
