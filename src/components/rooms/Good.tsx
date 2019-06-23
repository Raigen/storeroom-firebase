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

type GoodListEntryProps = { goodData: RoomGoodType }

export const GoodListEntry: React.FC<GoodListEntryProps> = ({ goodData }) => {
  const [good, loading, error] = useDocumentData<GoodType>(firestore.doc(`/goods/${goodData.ref.id}`), {
    idField: '_id'
  })
  if (error) return <li>Fehler: {error.message}</li>
  if (loading || !good) return null
  return (
    <Typography>
      {good.name} - {goodData.amount} {good.unit}
    </Typography>
  )
}
