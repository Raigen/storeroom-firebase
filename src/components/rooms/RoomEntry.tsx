import { Button, TextField } from '@material-ui/core'

import React from 'react'

type RoomEntryProps = {
  name: string
  onSave: () => void
  onChange: (name: string) => void
}

const RoomEntry: React.FC<RoomEntryProps> = ({ name, onSave, onChange }) => {
  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    event => onChange(event.target.value),
    []
  )
  return (
    <>
      <TextField placeholder="Name" value={name} onChange={changeHandler} />
      <Button onClick={onSave} disabled={name.length === 0}>
        Speichern
      </Button>
    </>
  )
}

export default RoomEntry
