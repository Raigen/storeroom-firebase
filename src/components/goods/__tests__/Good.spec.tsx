import { fireEvent, render } from '@testing-library/react'

import { GoodListEntry } from '../Good'
import React from 'react'

it('should render a good with name, unit and delete button', function() {
  const deleteEntry = jest.fn().mockName('onDelete')
  const { container } = render(
    <GoodListEntry good={{ _id: '1', name: 'Test good', unit: 'kg' }} onDelete={deleteEntry} isUsed={false} />
  )
  expect(container).toMatchSnapshot()
})

it('should render a good without delete button', function() {
  const deleteEntry = jest.fn().mockName('onDelete')
  const { container } = render(
    <GoodListEntry good={{ _id: '1', name: 'Test good', unit: 'kg' }} onDelete={deleteEntry} isUsed={true} />
  )
  expect(container).toMatchSnapshot()
})

it('should delete a good', async function() {
  const deleteEntry = jest.fn().mockName('onDelete')
  const { container, getByTitle } = render(
    <GoodListEntry good={{ _id: '1', name: 'Test good', unit: 'kg' }} onDelete={deleteEntry} isUsed={false} />
  )
  fireEvent.click(getByTitle('Löschen'))
  expect(deleteEntry).toHaveBeenCalledWith('1')
})
