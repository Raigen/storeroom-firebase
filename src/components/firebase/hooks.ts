import React from 'react'
import { SIGN_IN } from '../../constants/routes'
import { __RouterContext } from 'react-router'
import { auth } from './firebase'

export const useFirebaseUser = () => {
  const router = React.useContext(__RouterContext)
  const [user, setUser] = React.useState<firebase.User | null>(null)
  React.useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      setUser(user)
      if (!user) {
        router.history.push(SIGN_IN)
        // } else {
        //   router.history.push(ROOMLIST)
      }
    })
    return () => unregisterAuthObserver()
  }, [router.history])
  return user
}
