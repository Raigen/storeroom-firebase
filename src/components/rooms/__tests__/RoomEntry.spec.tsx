import { cleanup, fireEvent, render } from '@testing-library/react'

import React from 'react'
import RoomEntry from '../RoomEntry'

const onSave = jest.fn().mockName('onSave')
const onChange = jest.fn().mockName('onChange')

afterEach(function() {
  onSave.mockClear()
  onChange.mockClear()
  cleanup()
})

it('should disable the button when empty', function() {
  const { getByText } = render(<RoomEntry name="" onSave={onSave} onChange={onChange} />)

  expect(getByText('Speichern').closest('button')).toBeDisabled()
})

it('should enable the button when filled', function() {
  const onSave = jest.fn().mockName('onSave')
  const { getByText } = render(<RoomEntry name="test" onSave={onSave} onChange={onChange} />)

  expect(getByText('Speichern').closest('button')).toBeEnabled()
})

it('should call change and save handlers', function() {
  const onSave = jest.fn().mockName('onSave')
  const { getByText, getByPlaceholderText } = render(<RoomEntry name="test" onSave={onSave} onChange={onChange} />)

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'test2' } })
  expect(onChange).toHaveBeenCalledWith('test2')

  fireEvent.click(getByText('Speichern'))
  expect(onSave).toHaveBeenCalled()
})
