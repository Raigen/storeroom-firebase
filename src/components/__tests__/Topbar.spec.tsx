import { cleanup, fireEvent, render } from '@testing-library/react'

import React from 'react'
import { Topbar } from '../Topbar'
import { auth } from '../firebase/firebase'

jest.mock('../firebase/hooks', () => ({
  useFirebaseUser: jest
    .fn()
    .mockReturnValueOnce(null)
    .mockReturnValueOnce({ uid: '1' })
    .mockReturnValueOnce({ uid: '1' })
}))

jest.mock('../firebase/firebase', () => ({
  auth: {
    signOut: jest.fn().mockName('signOut')
  }
}))

afterEach(cleanup)

it('renders no logout button when not logged in', function() {
  const { queryByText } = render(<Topbar drawerWidth={100} />)

  expect(queryByText('Abmelden')).toBeNull()
})

it('renders the logout button for logged in users', function() {
  const { getByText } = render(<Topbar drawerWidth={100} />)

  expect(getByText('Abmelden')).toBeTruthy()
})

it('signs out when logout button is pressed', function() {
  const { getByText } = render(<Topbar drawerWidth={100} />)

  fireEvent.click(getByText('Abmelden'))
  expect(auth.signOut).toHaveBeenCalled()
})
