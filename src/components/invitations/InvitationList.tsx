import { Button, Chip, List, ListItem, Typography } from '@material-ui/core'

import Check from '@material-ui/icons/Check'
import Close from '@material-ui/icons/Close'
import React from 'react'
import { firestore } from '../firebase/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useFirebaseUser } from '../firebase/hooks'

export type Invitation = {
  id: string
  email?: string
  household: string
  used: boolean
}

export const InvitationList: React.FC = () => {
  const { user, userData } = useFirebaseUser()

  const [linkCopied, setLinkCopied] = React.useState<string>()
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

  const createLink = (inviteId: string) => `${document.location.host}?inviteId=${inviteId}`
  const copyLink = (inviteId: string) =>
    navigator.clipboard.writeText(createLink(inviteId)).then(() => {
      setLinkCopied(inviteId)
      setTimeout(() => setLinkCopied(undefined), 1000)
    })

  return (
    <div>
      <Typography variant="h3">Einladungen</Typography>
      <List>
        {invitations.map(invite => (
          <ListItem key={invite.id}>
            <span onClick={() => copyLink(invite.id)}>{invite.id}</span>{' '}
            {invite.used ? <Check color="primary" /> : <Close color="error" />}
            {linkCopied === invite.id ? <Chip label="Link kopiert" /> : null}
          </ListItem>
        ))}
      </List>
      <Button onClick={addInvitationHandler}>Neue Einladung</Button>
    </div>
  )
}
