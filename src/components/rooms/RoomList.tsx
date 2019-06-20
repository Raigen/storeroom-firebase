import * as firebaseHooks from 'react-firebase-hooks/firestore'

import { Link, Route, RouteComponentProps } from 'react-router-dom'
import { ROOM, ROOMLIST } from '../../constants/routes'
import { Room, RoomType } from './Room'

import React from 'react'
import { firestore } from '../firebase/firebase'
import { useFirebaseUser } from '../firebase/hooks'

type RoomListProps = RouteComponentProps & {}

export const RoomsList: React.FC<RoomListProps> = ({ match }) => {
  const user = useFirebaseUser()
  const collectionPath = user ? `users/${user!.uid}/rooms` : 'null'
  const [rooms, loading, error] = firebaseHooks.useCollectionData<RoomType>(firestore.collection(collectionPath), {
    idField: '_id'
  })

  if (!user) return null
  if (error) return <div>Fehler: {error.message}</div>
  if (loading || !rooms || rooms.length === 0) return <div />
  return (
    <>
      <ul>
        {rooms.map(room => (
          <li key={room._id}>
            <Link to={`${ROOMLIST}${room._id}`}>{room.name}</Link>
          </li>
        ))}
      </ul>
      <hr />
      <Route path={ROOM} component={Room} />
    </>
  )
}
