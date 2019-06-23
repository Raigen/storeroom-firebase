import { cleanup, render } from '@testing-library/react'

import { MemoryRouter } from 'react-router'
import React from 'react'
import { RoomsList } from '../RoomList'
import { useCollectionData } from 'react-firebase-hooks/firestore'

jest.mock('../../firebase/hooks', () => ({
  useFirebaseUser: jest
    .fn()
    .mockReturnValueOnce(null)
    .mockReturnValue({ uid: '1' })
}))

jest.mock('react-firebase-hooks/firestore', () => ({
  useCollectionData: jest
    .fn()
    .mockName('useCollectionData')
    .mockReturnValue([[], false, null])
}))

afterEach(cleanup)

const rooms = [{ _id: '1', name: 'Test 1' }, { _id: '2', name: 'Test 2' }]

it('should render nothing when not logged in', function() {
  const { container } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  expect(container).toMatchInlineSnapshot(`<div />`)
})

it('should render the room list of the logged in user', function() {
  ;(useCollectionData as any).mockReturnValueOnce([rooms, false, null])
  const { getByText } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  expect(getByText('Test 1')).not.toBeNull()
  expect(getByText('Test 2')).not.toBeNull()
})

it('should render the database error', function() {
  ;(useCollectionData as any).mockReturnValueOnce([null, false, new Error('Test error')])
  const { getByText } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  expect(getByText('Fehler: Test error')).not.toBeNull()
})

it('should render nothing on loading', function() {
  ;(useCollectionData as any).mockReturnValueOnce([null, true, null])
  const { container } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  expect(container).toMatchInlineSnapshot(`<div />`)
})
