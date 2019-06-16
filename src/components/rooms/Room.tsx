import React from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import firebase from 'firebase'
import { RouteComponentProps } from 'react-router'
import { GoodsList } from './GoodsList'

export type RoomType = {
  _id: string
  name: string
}

type RoomProps = RouteComponentProps<{ id: string }> & {}

export const Room: React.FC<RoomProps> = ({ match }) => {
  const [room, loading, error] = useDocumentData<RoomType>(firebase.firestore().doc(`rooms/${match.params.id}`), {
    idField: '_id'
  })
  if (error) return <div>{error.message}</div>
  if (loading || !room) return null
  return (
    <div>
      <h3>{room.name}</h3>
      <GoodsList roomId={match.params.id} />
    </div>
  )
}
