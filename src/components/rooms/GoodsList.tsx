import React from 'react'
import { firestore } from '../firebase/firebase'
import { GoodListEntry } from './Good'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

export type RoomGoodType = {
  _id: string
  ref: firebase.firestore.DocumentReference
  amount: number
}

type GoodsListProps = {
  path: string
}

export const GoodsList: React.FC<GoodsListProps> = ({ path }) => {
  const [goods, loading, error] = useCollectionData<RoomGoodType>(firestore.collection(`${path}/goods`), {
    idField: '_id'
  })
  if (error) return <div>{error.message}</div>
  if (loading || !goods) return null
  return (
    <List>
      {goods.map(good => (
        <ListItem key={good._id}>
          <ListItemText primary={<GoodListEntry goodData={good} />} />
        </ListItem>
      ))}
    </List>
  )
}
