import { LANDING, ROOMLIST, SIGN_IN } from '../constants/routes'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import { Navigation } from './Navigation'
import React from 'react'
import { RoomsList } from './rooms/RoomList'
import { SignIn } from './auth/SignIn'

function Home() {
  return <h2>Home</h2>
}

export const App = () => (
  <div>
    <h1>Vorratskammer</h1>
    <Router>
      <Navigation />
      <hr />
      <Route path={LANDING} exact component={Home} />
      <Route path={ROOMLIST} component={RoomsList} />
      <Route path={SIGN_IN} component={SignIn} />
    </Router>
  </div>
)
