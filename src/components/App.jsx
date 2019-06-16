import { LANDING, ROOMLIST } from '../constants/routes'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import { Navigation } from './Navigation'
import React from 'react'
import { RoomsList } from './rooms/RoomList'

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
    </Router>
  </div>
)
