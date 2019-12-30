import { fireEvent, render, wait } from '@testing-library/react'

import { PendingInvitations } from '../PendingInvitation'
import React from 'react'
import { acceptInvite } from '../../firebase/firebase'

jest.mock('../../firebase/hooks')
jest.mock('../../firebase/firebase')
jest.mock('react-router', () => ({
  useLocation: () => ({ search: '?inviteId=1' })
}))
jest.mock('react-firebase-hooks/firestore', () => ({
  useDocumentDataOnce: jest
    .fn()
    .mockName('useDocumentDataOnce')
    .mockReturnValue([{ id: '1' }, false, null])
}))

it('accept invitation', async function() {
  const { getByText } = render(<PendingInvitations />)

  expect(getByText('Anzeigename (Test)')).not.toBeNull()

  fireEvent.click(getByText('Annehmen'))
  await wait()

  expect(acceptInvite).toHaveBeenCalledWith({ uid: '1', inviteId: '1' })
})
