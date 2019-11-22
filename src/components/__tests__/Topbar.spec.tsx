import { cleanup, fireEvent, render } from '@testing-library/react'

import React from 'react'
import { Topbar } from '../Topbar'
import { auth } from '../firebase/firebase'
import { useFirebaseUser } from '../firebase/hooks'

jest.mock('../firebase/hooks')

jest.mock('../firebase/firebase', () => ({
  auth: {
    signOut: jest.fn().mockName('signOut')
  }
}))

const handleDrawer = () => {}

afterEach(cleanup)

it('renders no logout button when not logged in', function() {
  ;(useFirebaseUser as jest.Mock).mockReturnValueOnce({ user: null, userData: null })
  const { queryByText } = render(<Topbar drawerWidth={100} handleDrawerToggle={handleDrawer} />)

  expect(queryByText('Abmelden')).toBeNull()
})

it('renders the logout button for logged in users', function() {
  const { getByText } = render(<Topbar drawerWidth={100} handleDrawerToggle={handleDrawer} />)

  expect(getByText('Abmelden')).toBeTruthy()
})

it('signs out when logout button is pressed', function() {
  const { getByText } = render(<Topbar drawerWidth={100} handleDrawerToggle={handleDrawer} />)

  fireEvent.click(getByText('Abmelden'))
  expect(auth.signOut).toHaveBeenCalled()
})
