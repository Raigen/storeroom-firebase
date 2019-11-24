import Button from '@material-ui/core/Button'
import { LANDING } from '../../constants/routes'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import { firestore } from '../firebase/firebase'
import { useFirebaseUser } from '../firebase/hooks'
import { useHistory } from 'react-router-dom'

export const HouseholdForm: React.FC = () => {
  const { user } = useFirebaseUser()
  const [name, setName] = React.useState('')
  const history = useHistory()

  const submitHandler = async () => {
    const household = await firestore.collection('households/').add({ name, users: [user!.uid] })
    await firestore.doc(`users/${user!.uid}`).update({ activeHousehold: household.id })
    history.push(LANDING)
  }
  return (
    <>
      <TextField
        label="Name"
        placeholder="Name"
        margin="normal"
        onChange={event => setName(event.target.value)}
        value={name}
      />
      <Button variant="contained" disabled={name.length === 0} onClick={submitHandler}>
        Speichern
      </Button>
    </>
  )
}
