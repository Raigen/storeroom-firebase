import { cleanup, render } from '@testing-library/react'

import React from 'react'
import { RouteComponentProps } from 'react-router'
import { SignIn } from '../SignIn'
import { useFirebaseUser } from '../../firebase/hooks'

jest.mock('react-firebaseui', () => ({
  FirebaseAuth: () => <div data-testid="firebase-ui" />
}))
jest.mock('../../firebase/firebase')
jest.mock('../../firebase/hooks')

const mockRouterProps: RouteComponentProps = {} as RouteComponentProps

afterEach(cleanup)

it('should render login form when not logged in', function() {
  ;(useFirebaseUser as jest.Mock).mockReturnValueOnce({ user: null, userData: null })
  const { queryByTestId } = render(<SignIn {...mockRouterProps} />)
  expect(queryByTestId('firebase-ui')).toBeTruthy()
})

it('should render welcome message for logged in users', function() {
  const { queryByTestId, getByText } = render(<SignIn {...mockRouterProps} />)
  expect(queryByTestId('firebase-ui')).toBeNull()
  expect(getByText('Willkommen!')).toBeTruthy()
})
