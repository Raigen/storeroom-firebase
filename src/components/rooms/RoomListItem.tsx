import { IconButton, ListItemSecondaryAction } from '@material-ui/core'

import CancelIcon from '@material-ui/icons/CancelOutlined'
import CheckIcon from '@material-ui/icons/CheckCircleOutline'
import DeleteIcon from '@material-ui/icons/Delete'
import Link from '@material-ui/core/Link'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { ROOMLIST } from '../../constants/routes'
import React from 'react'
import { RoomType } from './Room'
import { Link as RouterLink } from 'react-router-dom'
import { analytics } from '../firebase/firebase'

type RoomListItemProps = {
  room: RoomType
  onDelete: (id: string) => void
}
export const RoomListItem: React.FC<RoomListItemProps> = ({ room, onDelete }) => {
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
