import { GoodAmountInputField } from './GoodAmountInputField'
import React from 'react'
import { RoomGoodType } from './GoodsList'
import Typography from '@material-ui/core/Typography'
import { firestore } from '../firebase/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'

type GoodType = {
  _id: string
  name: string
  unit: string
}

export type GoodListEntryProps = {
  goodData: RoomGoodType
  setGoodAmount: (id: string) => (amount: number) => Promise<void>
}

export const GoodListEntry: React.FC<GoodListEntryProps> = ({ goodData, setGoodAmount }) => {
  const document = firestore.doc(`/goods/${goodData.ref.id}`)
  const [good, loading, error] = useDocumentData<GoodType>(document, {
    idField: '_id'
  })
  if (error) return <span>Fehler: {error.message}</span>
  if (loading || !good) return null
  return (
    <Typography component="div">
      {good.name} -
      <GoodAmountInputField amount={goodData.amount} updateAmount={setGoodAmount(goodData._id)} unit={good.unit} />
    </Typography>
  )
}
