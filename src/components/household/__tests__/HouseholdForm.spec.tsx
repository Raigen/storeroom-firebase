import { fireEvent, render, wait } from '@testing-library/react'

import { HouseholdForm } from '../HouseholdForm'
import React from 'react'
import { firestore } from '../../firebase/firebase'

jest.mock('../../firebase/hooks')
jest.mock('../../firebase/firebase')

const collectionAddMock = firestore.collection('').add as jest.Mock
const docUpdateMock = firestore.doc('').update as jest.Mock

it('create new household', async function() {
  collectionAddMock.mockReturnValue({ id: '1' })
  const { getByText, getByPlaceholderText } = render(<HouseholdForm />)

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'Household' } })
  fireEvent.click(getByText('Speichern'))

  await wait()

  expect(collectionAddMock).toHaveBeenCalledWith({ name: 'Household', users: ['1'] })
  expect(docUpdateMock).toHaveBeenCalledWith({ activeHousehold: '1' })
})
