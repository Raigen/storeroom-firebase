import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Delete from '@material-ui/icons/Delete'
import { GoodAmountInputField } from './GoodAmountInputField'
import IconButton from '@material-ui/core/IconButton'
import React from 'react'

type GoodListEnryProps = {
  id: string
  name: string
  unit: string
  amount: number
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string) => (amount: number) => Promise<void>
}

export const GoodListEntry: React.FC<GoodListEnryProps> = ({ onUpdate, onDelete, id, name, unit, amount }) => {
  return (
    <Card>
      <CardHeader
        title={name}
        titleTypographyProps={{ variant: 'body1' }}
        action={
          <IconButton onClick={() => onDelete(id)} title="Löschen">
            <Delete />
          </IconButton>
        }
      />
      <CardContent>
        <GoodAmountInputField amount={amount} updateAmount={onUpdate(id)} unit={unit} />
      </CardContent>
    </Card>
  )
}
