import { GoodListEntry, GoodType } from './Good'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'
import { firestore } from '../firebase/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

type ListProps = {}

export const GoodList: React.FC<ListProps> = () => {
  const [goods, loading, error] = useCollectionData<GoodType>(firestore.collection('/goods'), {
    idField: '_id'
  })
  if (error) return <div>Fehler: {error.message}</div>
  if (loading || !goods) return null
  return (
    <List>
      {goods.map(good => (
        <ListItem dense key={good._id}>
          <ListItemText primary={<GoodListEntry good={good} />} />
        </ListItem>
      ))}
    </List>
  )
}
