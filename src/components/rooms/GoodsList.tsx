import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import firebase from 'firebase'
import { GoodListEntry } from './Good'

export type RoomGoodType = {
  _id: string
  ref: firebase.firestore.DocumentReference
  amount: number
}

type GoodsListProps = {
  roomId: string
}

export const GoodsList: React.FC<GoodsListProps> = ({ roomId }) => {
  const [goods, loading, error] = useCollectionData<RoomGoodType>(
    firebase.firestore().collection(`/rooms/${roomId}/goods`),
    {
      idField: '_id'
    }
  )
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
