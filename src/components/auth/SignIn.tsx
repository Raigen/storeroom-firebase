import { FirebaseAuth } from 'react-firebaseui'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { auth } from '../firebase/firebase'
import firebase from 'firebase/app'
import { useFirebaseUser } from '../firebase/hooks'

type SignInProps = RouteComponentProps & {}

const uiConfig: firebaseui.auth.Config = {
  credentialHelper: 'none',
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
}

export const SignIn: React.FC<SignInProps> = () => {
  const user = useFirebaseUser()

  if (user) {
    return <p>Hallo {user.email}</p>
  } else {
    return <FirebaseAuth firebaseAuth={auth} uiConfig={uiConfig} />
  }
}
