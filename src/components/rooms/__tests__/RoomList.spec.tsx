import { cleanup, fireEvent, render } from '@testing-library/react'

import { MemoryRouter } from 'react-router'
import React from 'react'
import { RoomsList } from '../RoomList'
import { firestore } from '../../firebase/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useFirebaseUser } from '../../firebase/hooks'

jest.mock('react-firebase-hooks/firestore', () => ({
  useCollectionData: jest
    .fn()
    .mockName('useCollectionData')
    .mockReturnValue([[], false, null])
}))

jest.mock('../../firebase/firebase')
jest.mock('../../firebase/hooks')

afterEach(cleanup)

const rooms = [
  { _id: '1', name: 'Test 1' },
  { _id: '2', name: 'Test 2' }
]

it('should render nothing when not logged in', function() {
  ;(useFirebaseUser as jest.Mock).mockReturnValueOnce({ user: null, userData: null })
  const { container } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  expect(container).toMatchInlineSnapshot(`<div />`)
})

it('should render the room list of the logged in user', function() {
  ;(useCollectionData as jest.Mock).mockReturnValueOnce([rooms, false, null])
  const { getByText, getByPlaceholderText } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  expect(getByText('Test 1')).not.toBeNull()
  expect(getByText('Test 2')).not.toBeNull()
  expect(getByPlaceholderText('Name')).toBeTruthy()
})

it('should delete the first room', function() {
  ;(useCollectionData as jest.Mock).mockReturnValueOnce([rooms, false, null])
  const { getByTitle, getAllByTitle } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  fireEvent.click(getAllByTitle('Löschen')[0])
  fireEvent.click(getByTitle('Sicher'))

  expect(firestore.collection('users/1/rooms').doc('1').delete).toHaveBeenCalled()
})

it('should cancel the deletion', function() {
  ;(useCollectionData as jest.Mock).mockReturnValueOnce([rooms, false, null])
  const { getByTitle, getAllByTitle } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  fireEvent.click(getAllByTitle('Löschen')[0])
  fireEvent.click(getByTitle('Abbrechen'))

  expect(getAllByTitle('Löschen')).toHaveLength(2)
})

it('should render the database error', function() {
  ;(useCollectionData as jest.Mock).mockReturnValueOnce([null, false, new Error('Test error')])
  const { getByText } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  expect(getByText('Fehler: Test error')).not.toBeNull()
})

it('should render nothing on loading', function() {
  ;(useCollectionData as jest.Mock).mockReturnValueOnce([null, true, null])
  const { container } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  expect(container).toMatchInlineSnapshot(`<div />`)
})

it('should render the entry field with empty rooms', function() {
  ;(useCollectionData as jest.Mock).mockReturnValueOnce([[], false, null])
  const { getByPlaceholderText } = render(
    <MemoryRouter>
      <RoomsList />
    </MemoryRouter>
  )
  expect(getByPlaceholderText('Name')).toBeTruthy()
})
