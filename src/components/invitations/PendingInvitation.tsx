import { Button, Typography } from '@material-ui/core'
import { acceptInvite, firestore } from '../firebase/firebase'

import { Invitation } from './InvitationList'
import React from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useFirebaseUser } from '../firebase/hooks'
import { useLocation } from 'react-router'

export const PendingInvitations: React.FC = () => {
  const location = useLocation()
  const queries = new URLSearchParams(location.search)

  const inviteId = queries.get('inviteId') || 'none'
  const { user, userData } = useFirebaseUser()
  const [invite, loading, error] = useDocumentDataOnce<Invitation>(firestore.doc(`/invites/${inviteId}`))
  if (error) return <div>{error.message}</div>
  if (!user || !userData || !invite || loading || invite.used || Boolean(userData.activeHousehold)) return null

  const acceptHandler = async () => {
    try {
      await acceptInvite({ uid: user.uid, inviteId })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Typography variant="h5">Ausstehende Einladung</Typography>
      <Typography>Der Besitzer vom Haushalt bekommt Zugang zu folgenden Daten:</Typography>
      <ul>
        <li>Anzeigename ({userData.name})</li>
      </ul>
      <Button onClick={acceptHandler}>Annehmen</Button>
    </div>
  )
}
