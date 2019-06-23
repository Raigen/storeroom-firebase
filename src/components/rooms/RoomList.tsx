import * as firebaseHooks from 'react-firebase-hooks/firestore'

import Link from '@material-ui/core/Link'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { ROOMLIST } from '../../constants/routes'
import React from 'react'
import { RoomType } from './Room'
import { Link as RouterLink } from 'react-router-dom'
import { firestore } from '../firebase/firebase'
import { useFirebaseUser } from '../firebase/hooks'

type RoomListProps = {}

export const RoomsList: React.FC<RoomListProps> = () => {
  const user = useFirebaseUser()
  const collectionPath = user ? `users/${user!.uid}/rooms` : 'null'
  const [rooms, loading, error] = firebaseHooks.useCollectionData<RoomType>(firestore.collection(collectionPath), {
    idField: '_id'
  })

  if (!user) return null
  if (error) return <div>Fehler: {error.message}</div>
  if (loading || !rooms || rooms.length === 0) return null
  return (
    <>
      {rooms.map(room => (
        <ListItem key={room._id}>
          <ListItemText
            primary={
              <Link component={RouterLink} to={`${ROOMLIST}${room._id}`}>
                {room.name}
              </Link>
            }
          />
        </ListItem>
      ))}
    </>
  )
}
