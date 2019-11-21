import { analytics, auth, firestore } from './firebase'

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
  const [userData, setUserData] = React.useState<UserData | null>(null)
  React.useEffect(() => {
    if (user) {
      firestore
        .doc(`users/${user.uid}`)
        .get()
        .then(userData => {
          const data = userData.data() as UserData
          setUserData(data)
        })
    } else {
      setUserData(null)
    }
  }, [user])
  React.useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      setUser(user)
      if (!user) {
        router.history.push(SIGN_IN)
      } else {
        analytics.setUserId(user.uid)
        // router.history.push(ROOMLIST)
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
  const { user, userData } = useFirebaseUser()
  const [household, setHousehold] = React.useState<Household | null>(null)
  const [rooms, setRooms] = React.useState<RoomType[]>([])
  React.useEffect(() => {
    if (userData && user) {
      firestore
        .doc(`households/${userData.activeHousehold}`)
        .get()
        .then(snapshot => {
          if (snapshot.exists) {
            const data = { ...snapshot.data(), id: snapshot.ref.id } as Household
            if (data && data.users.includes(user.uid)) setHousehold(data)
          }
        })
    }
  }, [userData, user])
  React.useEffect(() => {
    if (household) {
      firestore
        .collection(`households/${household.id}/rooms`)
        .get()
        .then(snapshot => {
          setRooms(snapshot.docs.map(doc => ({ name: doc.get('name'), _id: doc.id } as RoomType)))
        })
    }
  }, [household])
  return { household, rooms }
}
