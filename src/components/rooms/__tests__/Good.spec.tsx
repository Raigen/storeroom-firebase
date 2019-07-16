import { cleanup, render } from '@testing-library/react'

import { GoodListEntry } from '../Good'
import React from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'

jest.mock('react-firebase-hooks/firestore', () => ({
  useDocumentData: jest
    .fn()
    .mockName('useDocumentData')
    .mockReturnValue([null, false, null])
}))
jest.mock('../GoodAmountInputField', () => ({
  GoodAmountInputField: (props: any) => <div data-testid="GoodAmountInputField" data-props={JSON.stringify(props)} />
}))

const good = { _id: '1', name: 'Test good', unit: 'kg' }
const goodData = { _id: '1', ref: { id: '1' } as any, amount: 10 }

const setGoodAmount = jest.fn().mockName('setGoodAmount')

afterEach(() => {
  setGoodAmount.mockReset()
  cleanup()
})

it('should render the goods name with amount and unit', function() {
  ;(useDocumentData as any).mockReturnValueOnce([good, false, null])
  const { container } = render(<GoodListEntry goodData={goodData} setGoodAmount={setGoodAmount} />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiTypography-root MuiTypography-body1"
      >
        Test good
      </div>
      <div
        data-props="{\\"amount\\":10,\\"unit\\":\\"kg\\"}"
        data-testid="GoodAmountInputField"
      />
    </div>
  `)
})

it('should render the database error', function() {
  ;(useDocumentData as any).mockReturnValueOnce([null, false, new Error('Test error')])
  const { getByText } = render(<GoodListEntry goodData={goodData} setGoodAmount={setGoodAmount} />)
  expect(getByText('Fehler: Test error')).not.toBeFalsy()
})

it('should render nothing on loading', function() {
  ;(useDocumentData as any).mockReturnValueOnce([null, true, null])
  const { container } = render(<GoodListEntry goodData={goodData} setGoodAmount={setGoodAmount} />)
  expect(container).toMatchInlineSnapshot(`<div />`)
})
