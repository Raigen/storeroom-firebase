import { analytics, auth, firestore } from './firebase'

import React from 'react'
import { SIGN_IN } from '../../constants/routes'
import { __RouterContext } from 'react-router'

type UserData = {
  admin: boolean
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
