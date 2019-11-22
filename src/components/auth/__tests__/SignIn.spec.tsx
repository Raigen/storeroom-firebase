import { MemoryRouter, RouteComponentProps } from 'react-router'
import { cleanup, render } from '@testing-library/react'

import { LANDING } from '../../../constants/routes'
import React from 'react'
import { Route } from 'react-router-dom'
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
  const { queryByTestId, getByText } = render(
    <MemoryRouter>
      <Route path={LANDING} render={() => <div>Landing!</div>} />
      <SignIn {...mockRouterProps} />
    </MemoryRouter>
  )
  expect(queryByTestId('firebase-ui')).toBeNull()
  expect(getByText('Landing!')).toBeTruthy()
})
