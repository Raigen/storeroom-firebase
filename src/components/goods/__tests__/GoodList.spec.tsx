import { act, cleanup, fireEvent, render } from '@testing-library/react'

import { GoodList } from '../GoodList'
import React from 'react'
import { firestore } from '../../firebase/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export function delay(duration: number) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve()
    }, duration)
  })
}

jest.mock('../Good', () => ({
  GoodListEntry: (props: any) => <div data-testid="good">{JSON.stringify(props)}</div>
}))

jest.mock('../../firebase/hooks', () => ({
  useFirebaseUser: jest
    .fn()
    .mockReturnValueOnce(null)
    .mockReturnValue({ uid: '1' })
}))

jest.mock('react-firebase-hooks/firestore', () => ({
  useCollectionData: jest
    .fn()
    .mockName('useCollectionData')
    .mockReturnValue([[], false, null])
}))

jest.mock('../../firebase/firebase')

afterEach(cleanup)

const path = '/users/1/rooms/1'
const goods = [{ _id: '1' }, { _id: '2' }]

it('should render the good list', function() {
  ;(useCollectionData as any).mockReturnValueOnce([goods, false, null])
  const { queryAllByTestId } = render(<GoodList />)
  const goodItems = queryAllByTestId('good')
  expect(goodItems[0]).toMatchInlineSnapshot(`
    <div
      data-testid="good"
    >
      {"good":{"_id":"1"}}
    </div>
  `)
  expect(goodItems[1]).toMatchInlineSnapshot(`
    <div
      data-testid="good"
    >
      {"good":{"_id":"2"}}
    </div>
  `)
})

it('should render the database error', function() {
  ;(useCollectionData as any).mockReturnValueOnce([null, false, new Error('Test error')])
  const { getByText } = render(<GoodList />)
  expect(getByText('Fehler: Test error')).not.toBeNull()
})

it('should render nothing on loading', function() {
  ;(useCollectionData as any).mockReturnValueOnce([null, true, null])
  const { container } = render(<GoodList />)
  expect(container).toMatchInlineSnapshot(`<div />`)
})

it('should add a new good', async function() {
  const { getByPlaceholderText, getByTestId } = render(<GoodList />)
  fireEvent.change(getByPlaceholderText('Zucker'), { target: { value: 'Mehl' } })
  fireEvent.change(getByPlaceholderText('kg'), { target: { value: 'g' } })
  fireEvent.submit(getByTestId('goodForm'))

  await delay(1)

  expect((getByPlaceholderText('Zucker') as HTMLInputElement).value).toEqual('')
  expect((getByPlaceholderText('kg') as HTMLInputElement).value).toEqual('')
  expect(firestore.collection('').add).toHaveBeenCalledWith({ name: 'Mehl', unit: 'g' })
})
