import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from '@material-ui/core/IconButton'
import React from 'react'
import Typography from '@material-ui/core/Typography'

export type GoodType = {
  _id: string
  name: string
  unit: string
}

type GoodListEntryProps = {
  good: GoodType
  onDelete: (id: string) => void
}

export const GoodListEntry: React.FC<GoodListEntryProps> = ({ good, onDelete }) => {
  return (
    <Typography>
      {good.name} - {good.unit}
      <IconButton onClick={() => onDelete(good._id)} title="Löschen">
        <DeleteIcon />
      </IconButton>
    </Typography>
  )
}
