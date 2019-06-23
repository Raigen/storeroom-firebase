import { cleanup, render } from '@testing-library/react'

import React from 'react'
import { RouteComponentProps } from 'react-router'
import { SignIn } from '../SignIn'

jest.mock('react-firebaseui', () => ({
  FirebaseAuth: () => <div data-testid="firebase-ui" />
}))

jest.mock('../../firebase/hooks', () => ({
  useFirebaseUser: jest
    .fn()
    .mockReturnValueOnce(null)
    .mockReturnValueOnce({ uid: '1' })
}))

const mockRouterProps: RouteComponentProps = {} as RouteComponentProps

afterEach(cleanup)

it('should render login form when not logged in', function() {
  const { queryByTestId } = render(<SignIn {...mockRouterProps} />)
  expect(queryByTestId('firebase-ui')).toBeTruthy()
})

it('should render welcome message for logged in users', function() {
  const { queryByTestId, queryByText } = render(<SignIn {...mockRouterProps} />)
  expect(queryByTestId('firebase-ui')).toBeNull()
  expect(queryByText('Willkommen!')).toBeTruthy()
})
