import React from 'react'
import Typography from '@material-ui/core/Typography'

export type GoodType = {
  _id: string
  name: string
  unit: string
}

type GoodListEntryProps = {
  good: GoodType
}

export const GoodListEntry: React.FC<GoodListEntryProps> = ({ good }) => {
  return (
    <Typography>
      {good.name} - {good.unit}
    </Typography>
  )
}
