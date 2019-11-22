import { cleanup, render } from '@testing-library/react'

import { Navigation } from '../Navigation'
import React from 'react'
import { useFirebaseUser } from '../firebase/hooks'

jest.mock('../rooms/RoomList', () => ({
  RoomsList: () => <div data-testid="room-list" />
}))
jest.mock('@material-ui/core/ListItem', () => () => <div />)

jest.mock('../firebase/hooks')

afterEach(cleanup)

it('renders nothing when not logged in', function() {
  ;(useFirebaseUser as jest.Mock).mockReturnValueOnce({ user: null, userData: null })
  const { queryByTestId } = render(<Navigation drawerWidth={100} isMobileOpen={false} handleDrawerToggle={() => {}} />)

  expect(queryByTestId('room-list')).toBeNull()
})

it('renders the roomlist for logged in users', function() {
  const { queryAllByTestId } = render(
    <Navigation drawerWidth={100} isMobileOpen={false} handleDrawerToggle={() => {}} />
  )

  expect(queryAllByTestId('room-list')).toHaveLength(2)
})
