import { analytics, firestore } from '../firebase/firebase'

import React from 'react'
import RoomEntry from './RoomEntry'

type RoomEntryControllerProps = {
  path: string
}

const RoomEntryController: React.FC<RoomEntryControllerProps> = ({ path }) => {
  const [name, setName] = React.useState('')
  const onSave = () => {
    analytics.logEvent('room_create', {})
    firestore.collection(path).add({ name })
    setName('')
  }

  return <RoomEntry name={name} onChange={setName} onSave={onSave} />
}

export default RoomEntryController
