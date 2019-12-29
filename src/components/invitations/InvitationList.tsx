import { Button, List, ListItem, Typography } from '@material-ui/core'

import React from 'react'
import { firestore } from '../firebase/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useFirebaseUser } from '../firebase/hooks'

type Invitation = {
  id: string
  email?: string
  household: string
  used: boolean
}

export const InvitationList: React.FC = () => {
  const { user, userData } = useFirebaseUser()

  const [invitations, loading, error] = useCollectionData<Invitation>(
    firestore.collection('/invites').where('ownerId', '==', user ? user.uid : ''),
    {
      idField: 'id'
    }
  )
  if (error) return <div>{error}</div>
  if (!invitations || loading || !user || !userData) return null

  const addInvitationHandler = () => {
    firestore.collection('/invites').add({
      ownerId: user.uid,
      email: '',
      household: userData.activeHousehold,
      used: false
    })
  }

  return (
    <div>
      <Typography variant="h3">Einladungen</Typography>
      <List>
        {invitations.map(invite => (
          <ListItem key={invite.id}>{invite.id}</ListItem>
        ))}
      </List>
      <Button onClick={addInvitationHandler}>Neue Einladung</Button>
    </div>
  )
}
