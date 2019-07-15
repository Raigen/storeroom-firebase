import React from 'react'
import RoomEntry from './RoomEntry'
import { firestore } from '../firebase/firebase'

type RoomEntryControllerProps = {
  path: string
}

const RoomEntryController: React.FC<RoomEntryControllerProps> = ({ path }) => {
  const [name, setName] = React.useState('')
  const onSave = () => {
    firestore.collection(path).add({ name })
    setName('')
  }

  return <RoomEntry name={name} onChange={setName} onSave={onSave} />
}

export default RoomEntryController
