import { RouteComponentProps, useLocation } from 'react-router'
import { analytics, auth, firestore } from '../firebase/firebase'

import { FirebaseAuth } from 'react-firebaseui'
import { LANDING } from '../../constants/routes'
import React from 'react'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase/app'
import { useFirebaseUser } from '../firebase/hooks'

type SignInProps = RouteComponentProps & {}

const uiConfig: firebaseui.auth.Config = {
  credentialHelper: 'none',
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: (result: firebase.auth.UserCredential) => {
      if (result.additionalUserInfo!.isNewUser) {
        firestore.doc(`users/${result.user!.uid}`).set({
          admin: false,
          name: result.user!.displayName,
          picture: result.user!.photoURL,
          email: result.user!.email,
          activeHousehold: ''
        })
        analytics.logEvent('sign_up', { method: result.credential!.signInMethod })
      } else {
        analytics.logEvent('login', { method: result.credential!.signInMethod })
      }

      return false
    }
  }
}

export const SignIn: React.FC<SignInProps> = () => {
  const { user } = useFirebaseUser()
  const location = useLocation()

  if (user) {
    return <Redirect to={LANDING + location.search} />
  } else {
    return <FirebaseAuth firebaseAuth={auth} uiConfig={uiConfig} />
  }
}
