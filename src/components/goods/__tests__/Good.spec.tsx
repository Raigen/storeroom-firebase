import { GoodListEntry } from '../Good'
import React from 'react'
import { render } from '@testing-library/react'

it('should render a good with name and unit', function() {
  const { container } = render(<GoodListEntry good={{ _id: '1', name: 'Test good', unit: 'kg' }} />)
  expect(container).toMatchInlineSnapshot(`
    <div>
      <p
        class="MuiTypography-root MuiTypography-body1"
      >
        Test good
         - 
        kg
      </p>
    </div>
  `)
})
