import { analytics, auth } from '../firebase/firebase'

import { FirebaseAuth } from 'react-firebaseui'
import { LANDING } from '../../constants/routes'
import React from 'react'
import { Redirect } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import firebase from 'firebase/app'
import { useFirebaseUser } from '../firebase/hooks'

type SignInProps = RouteComponentProps & {}

const uiConfig: firebaseui.auth.Config = {
  credentialHelper: 'none',
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    }
  ],
  callbacks: {
    signInSuccessWithAuthResult: (result: firebase.auth.UserCredential) => {
      if (result.additionalUserInfo!.isNewUser) {
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

  if (user) {
    return <Redirect to={LANDING} />
  } else {
    return <FirebaseAuth firebaseAuth={auth} uiConfig={uiConfig} />
  }
}
