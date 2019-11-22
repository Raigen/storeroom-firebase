import { analytics, auth, firestore } from './firebase'
import { useCollectionData, useDocumentDataOnce } from 'react-firebase-hooks/firestore'

import React from 'react'
import { RoomType } from '../rooms/Room'
import { SIGN_IN } from '../../constants/routes'
import { __RouterContext } from 'react-router'

type UserData = {
  admin: boolean
  activeHousehold?: string
}

export function useFirebaseUser(): { userData: UserData | null; user: firebase.User | null } {
  const router = React.useContext(__RouterContext)
  const [user, setUser] = React.useState<firebase.User | null>(null)

  const docRef = user ? firestore.doc(`users/${user.uid}`) : null
  const [userData = null, , error] = useDocumentDataOnce<UserData>(docRef)
  if (error) console.error(error)
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

type Household = {
  id: string
  users: String[]
  rooms: any[]
}

export function useHousehold(): { household: Household | null; rooms: RoomType[] } {
  const { userData } = useFirebaseUser()

  const householdRef = userData ? firestore.doc(`households/${userData.activeHousehold}`) : null
  const [household = null] = useDocumentDataOnce<Household>(householdRef, { idField: 'id' })

  const roomRef = household ? firestore.collection(`households/${household.id}/rooms`) : null
  const [rooms = []] = useCollectionData<RoomType>(roomRef, { idField: '_id' })
  return { household, rooms }
}
