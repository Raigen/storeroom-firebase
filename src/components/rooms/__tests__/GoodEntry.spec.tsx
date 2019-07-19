import { cleanup, fireEvent, render } from '@testing-library/react'

import { GoodEntry } from '../GoodEntry'
import React from 'react'
import { firestore } from '../../firebase/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'

jest.mock('../../Autosuggest/Autosuggest', () => ({
  Autosuggest: (props: any) => (
    <div data-testid="Autosuggest" data-suggestions={JSON.stringify(props.suggestions)}>
      <button onClick={() => props.onChange(props.suggestions[0])}>onChange Autosuggest</button>
    </div>
  )
}))
jest.mock('../GoodAmountInputField', () => ({
  GoodAmountInputField: (props: any) => (
    <div data-testid="GoodAmountInputField" data-props={JSON.stringify(props)}>
      <button onClick={() => props.updateAmount(10)}>updateAmount GoodAmountInputField</button>
    </div>
  )
}))

jest.mock('react-firebase-hooks/firestore', () => ({
  useCollection: jest
    .fn()
    .mockName('useCollection')
    .mockReturnValue([undefined, true, undefined])
}))

jest.mock('../../firebase/firebase')

function delay(duration: number) {
  return function() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve()
      }, duration)
    })
  }
}
const mockData = [{ name: 'Good 1', ref: 'reference', unit: 'kg' }, { name: 'Good 2', unit: 'l' }]
const mockCollection = {
  docs: [{ data: jest.fn().mockReturnValue(mockData[0]) }, { data: jest.fn().mockReturnValue(mockData[1]) }]
}

afterEach(cleanup)

it('should render empty input fields with no suggestions found and button disabled', function() {
  ;(useCollection as any).mockReturnValueOnce([undefined, false, undefined])
  const { getAllByTestId, getByTestId, getByText } = render(<GoodEntry path="/users/1/rooms/1" />)

  expect(getAllByTestId('Autosuggest')[0]).toHaveAttribute('data-suggestions', '[]')
  expect(getAllByTestId('Autosuggest')[1]).toHaveAttribute('data-suggestions', '[]')

  expect(getByTestId('GoodAmountInputField')).toHaveAttribute('data-props', JSON.stringify({ amount: 0, unit: '' }))

  expect(getByText('Hinzufügen').closest('button')).toHaveAttribute('disabled')
})

it('should render empty input fields with filled suggestions', function() {
  ;(useCollection as any).mockReturnValueOnce([mockCollection, false, undefined])
  const { getAllByTestId } = render(<GoodEntry path="/users/1/rooms/1" />)

  expect(getAllByTestId('Autosuggest')[0]).toHaveAttribute(
    'data-suggestions',
    JSON.stringify([{ name: 'Good 1', unit: 'kg' }, { name: 'Good 2', unit: 'l' }])
  )
  expect(getAllByTestId('Autosuggest')[1]).toHaveAttribute(
    'data-suggestions',
    JSON.stringify([{ name: 'kg' }, { name: 'l' }])
  )
})

it('should enable the submit button when all goodData are filled', function() {
  ;(useCollection as jest.Mock).mockReturnValueOnce([mockCollection, false, undefined])
  const { getByText, getAllByText } = render(<GoodEntry path="/users/1/rooms/1" />)

  // set good name to Good 1 and unit to kg
  fireEvent.click(getAllByText('onChange Autosuggest')[0])
  // set good amount to 10
  fireEvent.click(getAllByText('updateAmount GoodAmountInputField')[0])

  expect(getByText('Hinzufügen').closest('button')).not.toHaveAttribute('disabled')
})

it('should update good unit when an existing good is used', function() {
  ;(useCollection as jest.Mock).mockReturnValueOnce([mockCollection, false, undefined])
  const { getAllByText, getAllByTestId } = render(<GoodEntry path="/users/1/rooms/1" />)

  fireEvent.click(getAllByText('onChange Autosuggest')[0])
  expect(getAllByTestId('GoodAmountInputField')[0]).toHaveAttribute(
    'data-props',
    JSON.stringify({ amount: 0, unit: 'kg' })
  )
})

it('should update good amount', function() {
  ;(useCollection as jest.Mock).mockReturnValueOnce([mockCollection, false, undefined])
  const { getAllByText, getAllByTestId } = render(<GoodEntry path="/users/1/rooms/1" />)

  fireEvent.click(getAllByText('updateAmount GoodAmountInputField')[0])
  expect(getAllByTestId('GoodAmountInputField')[0]).toHaveAttribute(
    'data-props',
    JSON.stringify({ amount: 10, unit: '' })
  )
})

it.skip('should create new good and save new good in room', function() {
  const add = jest
    .fn()
    .mockName('collectionAdd')
    .mockResolvedValue('reference')
  ;(useCollection as jest.Mock).mockReturnValueOnce([mockCollection, false, undefined])
  ;(firestore.collection as jest.Mock)
    .mockReturnValueOnce({ add })
    .mockReturnValueOnce({ add })
    .mockClear()
  const { getAllByText, getByText, getAllByTestId } = render(<GoodEntry path="/users/1/rooms/1" />)

  // set good name to Good 1 and unit to kg
  fireEvent.click(getAllByText('onChange Autosuggest')[0])
  // set good amount to 10
  fireEvent.click(getAllByText('updateAmount GoodAmountInputField')[0])
  // submit
  expect(getByText('Hinzufügen').closest('button')).not.toHaveAttribute('disabled')
  fireEvent.click(getByText('Hinzufügen'))

  delay(100)

  expect(firestore.collection).toHaveBeenCalledTimes(2)
  expect(firestore.collection).toHaveBeenNthCalledWith(1, 'goods/')
  expect(firestore.collection).toHaveBeenNthCalledWith(2, '/users/1/rooms/1/goods')

  // expect(add).toHaveBeenCalledTimes(2)
  expect(add).toHaveBeenNthCalledWith(1, { name: 'Good 1', unit: 'kg' })
  expect(add).toHaveBeenNthCalledWith(2, { amount: 10, ref: 'reference' })
})
