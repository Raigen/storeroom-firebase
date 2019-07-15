import 'jest-dom/extend-expect'

import { cleanup, fireEvent, render } from '@testing-library/react'

import React from 'react'
import RoomEntryController from '../RoomEntryController'
import { firestore } from '../../firebase/firebase'

jest.mock('../../firebase/firebase')

afterEach(cleanup)

it('should change the input field on change handler', function() {
  const { getByPlaceholderText } = render(<RoomEntryController path="users/1/rooms" />)

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'test' } })

  expect(getByPlaceholderText('Name')).toHaveValue('test')
})

it('should save the new entry to firebase', function() {
  const { getByPlaceholderText, getByText } = render(<RoomEntryController path="users/1/rooms" />)

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'test' } })
  fireEvent.click(getByText('Speichern'))

  expect(getByPlaceholderText('Name')).toHaveValue('')

  expect(firestore.collection('').add).toHaveBeenCalledWith({ name: 'test' })
})
