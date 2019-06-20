import { LANDING, ROOMLIST, SIGN_IN, SIGN_UP } from '../constants/routes'

import { Link } from 'react-router-dom'
import React from 'react'
import { auth } from './firebase/firebase'
import { useFirebaseUser } from './firebase/hooks'

export const Navigation = () => {
  const user = useFirebaseUser()
  if (user) {
    return (
      <ul>
        <li>
          <Link to={LANDING}>Home</Link>
        </li>
        <li>
          <Link to={ROOMLIST}>Liste</Link>
        </li>
        <li>
          <button type="button" onClick={() => auth.signOut()}>
            Abmelden
          </button>
        </li>
      </ul>
    )
  } else {
    return (
      <ul>
        <li>
          <Link to={SIGN_UP}>Registrieren</Link>
        </li>
        <li>
          <Link to={SIGN_IN}>Anmelden</Link>
        </li>
      </ul>
    )
  }
}
