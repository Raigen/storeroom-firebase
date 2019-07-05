import { GoodListEntry } from './Good'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'
import { firestore } from '../firebase/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export type RoomGoodType = {
  _id: string
  ref: firebase.firestore.DocumentReference
  amount: number
}

export type GoodsListProps = {
  path: string
}

export const GoodsList: React.FC<GoodsListProps> = ({ path }) => {
  const [goods, loading, error] = useCollectionData<RoomGoodType>(firestore.collection(`${path}/goods`), {
    idField: '_id'
  })

  const setAmount = React.useCallback(
    (id: string) => async (newAmount: number) => {
      const document = firestore.doc(`${path}/goods/${id}`)
      await document.update('amount', newAmount)
    },
    [path]
  )

  if (error) return <div>Fehler: {error.message}</div>
  if (loading || !goods) return null
  return (
    <List>
      {goods.map(good => (
        <ListItem dense key={good._id}>
          <ListItemText primary={<GoodListEntry goodData={good} setGoodAmount={setAmount} />} />
        </ListItem>
      ))}
    </List>
  )
}
