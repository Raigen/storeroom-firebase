import { GoodsList } from './GoodsList'
import React from 'react'
import { firestore } from '../firebase/firebase'
import { RouteComponentProps } from 'react-router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useFirebaseUser } from '../firebase/hooks'

export type RoomType = {
  _id: string
  name: string
}

type RoomProps = RouteComponentProps<{ id: string }> & {}

export const Room: React.FC<RoomProps> = ({ match }) => {
  const user = useFirebaseUser()
  const collectionPath = user ? `users/${user!.uid}/rooms/${match.params.id}` : 'null/1'
  const [room, loading, error] = useDocumentData<RoomType>(firestore.doc(collectionPath), {
    idField: '_id'
  })
  if (error) return <div>{error.message}</div>
  if (loading || !room) return null
  return (
    <div>
      <h3>{room.name}</h3>
      <GoodsList path={collectionPath} />
    </div>
  )
}
