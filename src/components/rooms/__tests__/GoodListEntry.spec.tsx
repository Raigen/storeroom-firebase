import { cleanup, fireEvent, render } from '@testing-library/react'

import { GoodListEntry } from '../GoodListEntry'
import React from 'react'

const updateAmount = jest
  .fn()
  .mockName('updateAmount')
  .mockResolvedValue(null)
const updateHandler = jest
  .fn()
  .mockName('updateHandler')
  .mockReturnValue(updateAmount)
const deleteHandler = jest
  .fn()
  .mockName('deleteHandler')
  .mockResolvedValue(null)

afterEach(function() {
  cleanup()
  updateHandler.mockClear()
  deleteHandler.mockClear()
})

it('updates the amount on blur', async function() {
  const { getByPlaceholderText } = render(
    <GoodListEntry onDelete={deleteHandler} onUpdate={updateHandler} id="1" amount={10} name="Test" unit="kg" />
  )

  fireEvent.change(getByPlaceholderText('Menge'), { target: { value: '20' } })
  fireEvent.blur(getByPlaceholderText('Menge'))

  expect(updateAmount).toHaveBeenCalledWith(20)
})

it('deletes the entry', async function() {
  const { getByTitle } = render(
    <GoodListEntry onDelete={deleteHandler} onUpdate={updateHandler} id="1" amount={10} name="Test" unit="kg" />
  )

  fireEvent.click(getByTitle('Löschen'))

  expect(deleteHandler).toHaveBeenCalledWith('1')
})
