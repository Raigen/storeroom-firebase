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

afterEach(cleanup)

const good = { _id: '1', name: 'Test good', unit: 'kg' }
const goodData = { _id: '1', ref: { id: '1' } as any, amount: 10 }

it('should render the goods name with amount and unit', function() {
  ;(useDocumentData as any).mockReturnValueOnce([good, false, null])
  const { getByText } = render(<GoodListEntry goodData={goodData} />)
  expect(getByText('Test good - 10 kg')).not.toBeNull()
})

it('should render the database error', function() {
  ;(useDocumentData as any).mockReturnValueOnce([null, false, new Error('Test error')])
  const { getByText } = render(<GoodListEntry goodData={goodData} />)
  expect(getByText('Fehler: Test error')).not.toBeNull()
})

it('should render nothing on loading', function() {
  ;(useDocumentData as any).mockReturnValueOnce([null, true, null])
  const { container } = render(<GoodListEntry goodData={goodData} />)
  expect(container).toMatchInlineSnapshot(`<div />`)
})
