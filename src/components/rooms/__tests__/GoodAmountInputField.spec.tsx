import { cleanup, fireEvent, render } from '@testing-library/react'

import { GoodAmountInputField } from '../GoodAmountInputField'
import React from 'react'

const updateAmount = jest.fn().mockName('updateAmount')

afterEach(() => {
  updateAmount.mockReset()
  cleanup()
})

const renderWithLabel = (ui: React.ReactElement) => render(<label>Test{ui}</label>)

it('should render the input field with correct amount and unit', function() {
  const { getByLabelText } = renderWithLabel(<GoodAmountInputField amount={10} unit="kg" updateAmount={updateAmount} />)
  expect(getByLabelText('Testkg')).toMatchInlineSnapshot(`
    <input
      aria-invalid="false"
      class="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedEnd"
      placeholder="Menge"
      type="text"
      value="10"
    />
  `)
})

it('should change the amount on blur', function() {
  const { getByLabelText } = renderWithLabel(<GoodAmountInputField amount={10} unit="kg" updateAmount={updateAmount} />)
  fireEvent.change(getByLabelText('Testkg'), { target: { value: '40' } })
  fireEvent.blur(getByLabelText('Testkg'))
  expect(updateAmount).toHaveBeenCalledWith(40)
})

it('should change the amount to zero on empty field', function() {
  const { getByLabelText } = renderWithLabel(<GoodAmountInputField amount={10} unit="kg" updateAmount={updateAmount} />)
  fireEvent.change(getByLabelText('Testkg'), { target: { value: '' } })
  fireEvent.blur(getByLabelText('Testkg'))
  expect(updateAmount).toHaveBeenCalledWith(0)
})
