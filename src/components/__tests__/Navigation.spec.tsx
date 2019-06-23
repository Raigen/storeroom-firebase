import { cleanup, render } from '@testing-library/react'

import { Navigation } from '../Navigation'
import React from 'react'

jest.mock('../rooms/RoomList', () => ({
  RoomsList: () => <div data-testid="room-list" />
}))

jest.mock('../firebase/hooks', () => ({
  useFirebaseUser: jest
    .fn()
    .mockReturnValueOnce(null)
    .mockReturnValueOnce({ uid: '1' })
}))

afterEach(cleanup)

it('renders nothing when not logged in', function() {
  const { queryByTestId } = render(<Navigation drawerWidth={100} />)

  expect(queryByTestId('room-list')).toBeNull()
})

it('renders the roomlist for logged in users', function() {
  const { queryByTestId } = render(<Navigation drawerWidth={100} />)

  expect(queryByTestId('room-list')).toBeTruthy()
})
