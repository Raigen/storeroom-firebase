import * as firebaseHooks from 'react-firebase-hooks/firestore'

import { Link, Route, RouteComponentProps } from 'react-router-dom'
import { ROOM, ROOMLIST } from '../../constants/routes'
import { Room, RoomType } from './Room'

import React from 'react'
import firebase from 'firebase'

type RoomListProps = RouteComponentProps & {}

export const RoomsList: React.FC<RoomListProps> = ({ match }) => {
  const [rooms, loading, error] = firebaseHooks.useCollectionData<RoomType>(firebase.firestore().collection('rooms'), {
    idField: '_id'
  })

  if (error) return <div>{error.message}</div>
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
