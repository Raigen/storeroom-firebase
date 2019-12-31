import { Link, Redirect } from 'react-router-dom'
import { NEW_HOUSEHOLD, ROOM } from '../constants/routes'

import Button from '@material-ui/core/Button'
import { PendingInvitations } from './invitations/PendingInvitation'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import { useHousehold } from './firebase/hooks'

export function HomeIntro() {
  const { household, rooms } = useHousehold()
  if (household) {
    if (rooms.length > 0) return <Redirect to={ROOM.replace(':id', rooms[0]._id)} />
    return (
      <>
        <Typography variant="h2">Willkommen bei Inventorium!</Typography>
        <Typography>Großartig! Nun erstelle im Seitenmenu deinen ersten Raum!</Typography>
      </>
    )
  }
  return (
    <>
      <Typography variant="h2">Willkommen bei Inventorium!</Typography>
      <Typography>Es sieht so aus als ob du noch keinen Haushalt eingerichtet hast.</Typography>
      <Typography>
        Du kannst hier einen eigenen Haushalt einrichten. Oder du lässt dich in den Haushalt eines Mitbewohners oder
        Familienmitglieds einladen.
      </Typography>
      <Button component={Link} to={NEW_HOUSEHOLD}>
        Haushalt erstellen
      </Button>
      <PendingInvitations />
    </>
  )
}
