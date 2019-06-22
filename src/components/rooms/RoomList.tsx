import * as firebaseHooks from 'react-firebase-hooks/firestore'

import { Link as RouterLink, Route, RouteComponentProps } from 'react-router-dom'
import { ROOM, ROOMLIST } from '../../constants/routes'
import { Room, RoomType } from './Room'

import React from 'react'
import { firestore } from '../firebase/firebase'
import { useFirebaseUser } from '../firebase/hooks'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

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
    <Grid container>
      <Grid item>
        <List>
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
        </List>
      </Grid>
      <Grid item>
        <Route path={ROOM} component={Room} />
      </Grid>
    </Grid>
  )
}
