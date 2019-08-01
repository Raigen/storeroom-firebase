import { cleanup, fireEvent, render } from '@testing-library/react'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'

import { GoodsList } from '../GoodsList'
import React from 'react'
import { firestore } from '../../firebase/firebase'

function delay(duration: number) {
  return function() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve()
      }, duration)
    })
  }
}

jest.mock('../GoodEntry', () => ({
  GoodEntry: (props: any) => <div data-testid="goodEntry" />
}))

jest.mock('../../firebase/hooks', () => ({
  useFirebaseUser: jest
    .fn()
    .mockReturnValueOnce(null)
    .mockReturnValue({ uid: '1' })
}))

jest.mock('react-firebase-hooks/firestore', () => ({
  useDocumentData: jest
    .fn()
    .mockName('useDocumentData')
    .mockReturnValue([{ _id: '1', unit: 'kg', name: 'Test' }, false, null]),
  useCollectionData: jest
    .fn()
    .mockName('useCollectionData')
    .mockReturnValue([[], false, null])
}))
jest.mock('../../firebase/firebase')

afterEach(cleanup)

const path = '/users/1/rooms/1'
const goods = [{ _id: '1', amount: 5, ref: { id: '1' } }, { _id: '2', amount: 10, ref: { id: '1' } }]

it('should render the database error', function() {
  ;(useCollectionData as any).mockReturnValueOnce([null, false, new Error('Test error')])
  const { getByText } = render(<GoodsList path={path} />)
  expect(getByText('Fehler: Test error')).not.toBeNull()
})

it('should render nothing on loading', function() {
  ;(useCollectionData as any).mockReturnValueOnce([null, true, null])
  const { container } = render(<GoodsList path={path} />)
  expect(container).toMatchInlineSnapshot(`<div />`)
})

it('should update the amount', function() {
  ;(useCollectionData as any).mockReturnValueOnce([goods, false, null])
  const { queryAllByPlaceholderText } = render(<GoodsList path={path} />)
  fireEvent.change(queryAllByPlaceholderText('Menge')[0], { target: { value: 10 } })
  fireEvent.blur(queryAllByPlaceholderText('Menge')[0])

  delay(10)

  expect(firestore.doc).toHaveBeenCalledWith(`${path}/goods/1`)
  expect(firestore.doc('/').update).toHaveBeenCalledWith('amount', 10)
})
