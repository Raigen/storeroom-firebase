import { fireEvent, render } from '@testing-library/react'

import { GoodListEntry } from '../Good'
import React from 'react'

it('should render a good with name and unit', function() {
  const deleteEntry = jest.fn().mockName('onDelete')
  const { container } = render(
    <GoodListEntry good={{ _id: '1', name: 'Test good', unit: 'kg' }} onDelete={deleteEntry} />
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      <p
        class="MuiTypography-root MuiTypography-body1"
      >
        Test good
         - 
        kg
        <button
          class="MuiButtonBase-root MuiIconButton-root"
          tabindex="0"
          title="Löschen"
          type="button"
        >
          <span
            class="MuiIconButton-label"
          >
            <svg
              aria-hidden="true"
              class="MuiSvgIcon-root"
              focusable="false"
              role="presentation"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
          </span>
          <span
            class="MuiTouchRipple-root"
          />
        </button>
      </p>
    </div>
  `)
})

it('should delete a good', async function() {
  const deleteEntry = jest.fn().mockName('onDelete')
  const { container, getByTitle } = render(
    <GoodListEntry good={{ _id: '1', name: 'Test good', unit: 'kg' }} onDelete={deleteEntry} />
  )
  fireEvent.click(getByTitle('Löschen'))
  expect(deleteEntry).toHaveBeenCalledWith('1')
})
