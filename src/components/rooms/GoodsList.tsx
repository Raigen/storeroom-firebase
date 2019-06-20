import React from 'react'
import { firestore } from '../firebase/firebase'
import { GoodListEntry } from './Good'
import { useCollectionData } from 'react-firebase-hooks/firestore'

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
    <ul>
      {goods.map(good => (
        <li key={good._id}>
          <GoodListEntry goodData={good} />
        </li>
      ))}
    </ul>
  )
}
