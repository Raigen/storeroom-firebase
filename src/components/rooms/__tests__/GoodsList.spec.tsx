import { cleanup, fireEvent, render } from '@testing-library/react'

import { GoodListEntryProps } from '../Good'
import { GoodsList } from '../GoodsList'
import React from 'react'
import { firestore } from '../../firebase/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

function delay(duration: number) {
  return function() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve()
      }, duration)
    })
  }
}

jest.mock('../Good', () => ({
  GoodListEntry: (props: GoodListEntryProps) => (
    <div data-testid="good">
      {JSON.stringify(props)}
      <button data-testid="setGoodAmountButton" onClick={async () => await props.setGoodAmount(props.goodData._id)(10)}>
        click
      </button>
    </div>
  )
}))

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
  const { queryAllByTestId } = render(<GoodsList path={path} />)
  const goodItems = queryAllByTestId('good')
  expect(goodItems[0]).toMatchInlineSnapshot(`
    <div
      data-testid="good"
    >
      {"goodData":{"_id":"1"}}
      <button
        data-testid="setGoodAmountButton"
      >
        click
      </button>
    </div>
  `)
  expect(goodItems[1]).toMatchInlineSnapshot(`
    <div
      data-testid="good"
    >
      {"goodData":{"_id":"2"}}
      <button
        data-testid="setGoodAmountButton"
      >
        click
      </button>
    </div>
  `)
})

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
  const { queryAllByTestId } = render(<GoodsList path={path} />)
  fireEvent.click(queryAllByTestId('setGoodAmountButton')[0])

  delay(10)

  expect(firestore.doc).toHaveBeenCalledWith(`${path}/goods/1`)
  expect(firestore.doc('/').update).toHaveBeenCalledWith('amount', 10)
})
