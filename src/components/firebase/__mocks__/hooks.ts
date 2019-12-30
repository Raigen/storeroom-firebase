export const useFirebaseUser = jest
  .fn()
  .mockName('useFirebaseUser')
  .mockReturnValue({ user: { uid: '1' }, userData: { name: 'Test', admin: false, activeHousehold: '1' } })

export const useHousehold = jest
  .fn()
  .mockName('useHousehold')
  .mockReturnValue({ household: { id: '1', users: [], rooms: [] }, rooms: [] })
