import { GoodsList } from './GoodsList'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import Typography from '@material-ui/core/Typography'
import { firestore } from '../firebase/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useHousehold } from '../firebase/hooks'

export type RoomType = {
  _id: string
  name: string
}

type RoomProps = RouteComponentProps<{ id: string }> & {}

export const Room: React.FC<RoomProps> = ({ match }) => {
  const { household } = useHousehold()
  const collectionPath = household ? `households/${household.id}/rooms/${match.params.id}` : 'null/1'
  const [room, loading, error] = useDocumentData<RoomType>(firestore.doc(collectionPath), {
    idField: '_id'
  })
  if (error) return <div>Fehler: {error.message}</div>
  if (loading || !room) return null
  return (
    <div>
      <Typography variant="h3">{room.name}</Typography>
      <GoodsList path={collectionPath} />
    </div>
  )
}
