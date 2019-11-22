import { cleanup, render } from '@testing-library/react'

import React from 'react'
import { Room } from '../Room'
import { RouteComponentProps } from 'react-router'
import { useDocumentData } from 'react-firebase-hooks/firestore'

jest.mock('../GoodsList', () => ({
  GoodsList: (props: any) => <div data-testid="goods-list">{JSON.stringify(props)}</div>
}))
jest.mock('../../firebase/hooks')
jest.mock('../../firebase/firebase')

jest.mock('react-firebase-hooks/firestore', () => ({
  useDocumentData: jest
    .fn()
    .mockName('useDocumentData')
    .mockReturnValue([null, false, null])
}))

const mockRouterProps: RouteComponentProps<{ id: string }> = { match: { params: { id: '1' } } } as RouteComponentProps<{
  id: string
}>

afterEach(cleanup)

const room = {
  name: 'Test room'
}

it('should render the room name and good list', function() {
  ;(useDocumentData as any).mockReturnValueOnce([room, false, null])
  const { getByText, queryByTestId } = render(<Room {...mockRouterProps} />)
  expect(getByText('Test room')).not.toBeNull()
  expect(queryByTestId('goods-list')).toMatchInlineSnapshot(`
    <div
      data-testid="goods-list"
    >
      {"path":"households/1/rooms/1"}
    </div>
  `)
})

it('should render the database error', function() {
  ;(useDocumentData as any).mockReturnValueOnce([null, false, new Error('Test error')])
  const { getByText } = render(<Room {...mockRouterProps} />)
  expect(getByText('Fehler: Test error')).not.toBeNull()
})

it('should render nothing on loading', function() {
  ;(useDocumentData as any).mockReturnValueOnce([null, true, null])
  const { container } = render(<Room {...mockRouterProps} />)
  expect(container).toMatchInlineSnapshot(`<div />`)
})
