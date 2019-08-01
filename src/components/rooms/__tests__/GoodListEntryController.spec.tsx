import { cleanup, fireEvent, render } from '@testing-library/react'

import { GoodListEntryController } from '../GoodListEntryController'
import React from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'

jest.mock('../../firebase/firebase')
jest.mock('react-firebase-hooks/firestore', () => ({
  useDocumentData: jest
    .fn()
    .mockName('useDocumentData')
    .mockReturnValue([null, false, null])
}))
const good = { _id: '1', name: 'Test good', unit: 'kg' }
const goodData = { _id: '1', ref: { id: '1' } as any, amount: 10 }

const updateAmount = jest
  .fn()
  .mockName('updateAmount')
  .mockResolvedValue(null)
const setGoodAmount = jest
  .fn()
  .mockName('setGoodAmount')
  .mockReturnValue(updateAmount)
const deleteGoodAmount = jest.fn().mockName('deleteGoodAmount')

afterEach(() => {
  updateAmount.mockClear()
  setGoodAmount.mockClear()
  deleteGoodAmount.mockClear()
  cleanup()
})

it('should render the database error', function() {
  ;(useDocumentData as jest.Mock).mockReturnValueOnce([null, false, new Error('Test error')])
  const { getByText } = render(
    <GoodListEntryController goodData={goodData} setAmount={setGoodAmount} deleteGood={deleteGoodAmount} />
  )
  expect(getByText('Fehler: Test error')).not.toBeNull()
})

it('should render nothing on loading', function() {
  ;(useDocumentData as jest.Mock).mockReturnValueOnce([null, true, null])
  const { container } = render(
    <GoodListEntryController goodData={goodData} setAmount={setGoodAmount} deleteGood={deleteGoodAmount} />
  )
  expect(container).toMatchInlineSnapshot(`<div />`)
})

it('updates the amount on blur', async function() {
  ;(useDocumentData as jest.Mock).mockReturnValueOnce([good, false, null])
  const { getByPlaceholderText } = render(
    <GoodListEntryController goodData={goodData} setAmount={setGoodAmount} deleteGood={deleteGoodAmount} />
  )

  fireEvent.change(getByPlaceholderText('Menge'), { target: { value: '20' } })
  fireEvent.blur(getByPlaceholderText('Menge'))

  expect(updateAmount).toHaveBeenCalledWith(20)
})

it('deletes the entry', async function() {
  ;(useDocumentData as jest.Mock).mockReturnValueOnce([good, false, null])
  const { getByTitle } = render(
    <GoodListEntryController goodData={goodData} setAmount={setGoodAmount} deleteGood={deleteGoodAmount} />
  )

  fireEvent.click(getByTitle('Löschen'))

  expect(deleteGoodAmount).toHaveBeenCalledWith('1')
})
