import { fireEvent, render, wait } from '@testing-library/react'

import { InvitationList } from '../InvitationList'
import React from 'react'
import { firestore } from '../../firebase/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

jest.mock('../../firebase/firebase')
jest.mock('../../firebase/hooks')
jest.mock('react-firebase-hooks/firestore', () => ({
  useCollectionData: jest
    .fn()
    .mockName('useCollectionData')
    .mockReturnValue([[], false, null])
}))

const invites = [
  { id: '1', ownerId: '123' },
  { id: '2', ownerId: '123' }
]

it('list all invite ids', async function() {
  ;(useCollectionData as jest.Mock).mockReturnValueOnce([invites, false, null])
  const { getByText } = render(<InvitationList />)

  expect(getByText('1')).not.toBeNull()
  expect(getByText('2')).not.toBeNull()
})

it('add new invite', async function() {
  ;(useCollectionData as jest.Mock).mockReturnValueOnce([invites, false, null])
  const { getByText } = render(<InvitationList />)

  fireEvent.click(getByText('Neue Einladung'))
  await wait()

  expect(firestore.collection('/invites').add).toHaveBeenCalledWith({
    ownerId: '1',
    email: '',
    household: '1',
    used: false
  })
})
