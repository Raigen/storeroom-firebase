import { GoodListEntry } from './GoodListEntry'
import { GoodType } from '../goods/Good'
import React from 'react'
import { RoomGoodType } from './GoodsList'
import { firestore } from '../firebase/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'

type GoodListEntryControllerProps = {
  goodData: RoomGoodType
  setAmount: (id: string) => (amount: number) => Promise<void>
  deleteGood: (id: string) => Promise<void>
}

export const GoodListEntryController: React.FC<GoodListEntryControllerProps> = ({
  goodData,
  setAmount,
  deleteGood
}) => {
  const document = firestore.doc(`/goods/${goodData.ref.id}`)
  const [good, loading, error] = useDocumentData<GoodType>(document, {
    idField: '_id'
  })

  if (error) return <span>Fehler: {error.message}</span>
  if (loading || !good) return null

  return (
    <GoodListEntry
      amount={goodData.amount}
      id={goodData._id}
      name={good.name}
      unit={good.unit}
      onDelete={deleteGood}
      onUpdate={setAmount}
    />
  )
}
