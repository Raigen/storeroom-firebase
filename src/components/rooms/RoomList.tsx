import * as firebaseHooks from 'react-firebase-hooks/firestore'

import { IconButton, ListItemSecondaryAction } from '@material-ui/core'
import { analytics, firestore } from '../firebase/firebase'

import CancelIcon from '@material-ui/icons/CancelOutlined'
import CheckIcon from '@material-ui/icons/CheckCircleOutline'
import DeleteIcon from '@material-ui/icons/Delete'
import Link from '@material-ui/core/Link'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { ROOMLIST } from '../../constants/routes'
import React from 'react'
import RoomEntryController from './RoomEntryController'
import { RoomType } from './Room'
import { Link as RouterLink } from 'react-router-dom'
import { useFirebaseUser } from '../firebase/hooks'

type RoomListItemProps = {
  room: RoomType
  onDelete: (id: string) => void
}
const RoomListItem: React.FC<RoomListItemProps> = ({ room, onDelete }) => {
  const [showDeletePrompt, setShowDeletePrompt] = React.useState(false)

  return (
    <ListItem key={room._id}>
      <ListItemText
        primary={
          <Link
            component={RouterLink}
            to={`${ROOMLIST}${room._id}`}
            onClick={() => {
              analytics.setCurrentScreen(room.name)
            }}
          >
            {room.name}
          </Link>
        }
      />
      <ListItemSecondaryAction>
        {!showDeletePrompt && (
          <IconButton onClick={() => setShowDeletePrompt(true)}>
            <DeleteIcon titleAccess="Löschen" />
          </IconButton>
        )}
        {showDeletePrompt && (
          <>
            <IconButton onClick={() => onDelete(room._id)}>
              <CheckIcon titleAccess="Sicher" />
            </IconButton>
            <IconButton onClick={() => setShowDeletePrompt(false)}>
              <CancelIcon titleAccess="Abbrechen" />
            </IconButton>
          </>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

type RoomListProps = {}

export const RoomsList: React.FC<RoomListProps> = () => {
  const user = useFirebaseUser()
  const collectionPath = user ? `users/${user!.uid}/rooms` : 'null'
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
