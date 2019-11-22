import * as firebaseHooks from 'react-firebase-hooks/firestore'

import { analytics, firestore } from '../firebase/firebase'
import { useFirebaseUser, useHousehold } from '../firebase/hooks'

import ListItem from '@material-ui/core/ListItem'
import React from 'react'
import RoomEntryController from './RoomEntryController'
import { RoomListItem } from './RoomListItem'
import { RoomType } from './Room'

type RoomListProps = {}

export const RoomsList: React.FC<RoomListProps> = () => {
  const { user } = useFirebaseUser()
  const { household } = useHousehold()
  const collectionPath = household ? `households/${household.id}/rooms` : 'null'
  const [rooms, loading, error] = firebaseHooks.useCollectionData<RoomType>(firestore.collection(collectionPath), {
    idField: '_id'
  })

  const onDelete = (id: string) => {
    analytics.logEvent('room_delete', {})
    firestore
      .collection(collectionPath)
      .doc(id)
      .delete()
  }

  if (!user) return null
  if (!household) return <div>Noch kein Haushalt ausgewählt</div>
  if (error) return <div>Fehler: {error.message}</div>
  if (loading || !rooms) return null
  return (
    <>
      {rooms.map(room => (
        <RoomListItem key={room._id} room={room} onDelete={onDelete} />
      ))}
      <ListItem key="new">
        <RoomEntryController path={collectionPath} />
      </ListItem>
    </>
  )
}
