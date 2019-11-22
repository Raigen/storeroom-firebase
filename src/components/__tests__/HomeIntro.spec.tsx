import { Household, useHousehold } from '../firebase/hooks'

import { HomeIntro } from '../HomeIntro'
import { MemoryRouter } from 'react-router'
import { ROOM } from '../../constants/routes'
import React from 'react'
import { RoomType } from '../rooms/Room'
import { Route } from 'react-router-dom'
import { render } from '@testing-library/react'

jest.mock('../firebase/hooks')

const renderWithProvider = (ui: JSX.Element) =>
  render(
    <MemoryRouter>
      <Route path={ROOM.replace(':id', '1-1')} render={() => <div>Redirect successful!</div>} />
      {ui}
    </MemoryRouter>
  )

it('render welcome screen with household form', function() {
  ;(useHousehold as jest.Mock).mockReturnValue({ household: null, rooms: null })
  const { getByText } = renderWithProvider(<HomeIntro />)
  expect(getByText('Haushalt erstellen')).not.toBeNull()
})

it('render welcome screen with room note', function() {
  const household: Household = { id: '1', users: [] }
  ;(useHousehold as jest.Mock).mockReturnValue({ household, rooms: [] })
  const { getByText } = renderWithProvider(<HomeIntro />)
  expect(getByText('Großartig!', { exact: false })).not.toBeNull()
})

it('redirect to first room of the household', function() {
  const household: Household = { id: '1', users: [] }
  const rooms: RoomType[] = [{ _id: '1-1', name: 'Room 1' }]
  ;(useHousehold as jest.Mock).mockReturnValue({ household, rooms })
  const { getByText } = renderWithProvider(<HomeIntro />)
  expect(getByText('Redirect successful!')).not.toBeNull()
})
