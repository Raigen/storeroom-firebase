import { createStyles, makeStyles } from '@material-ui/core/styles'

import InputAdornment from '@material-ui/core/InputAdornment'
import React from 'react'
import { TextField } from '@material-ui/core'

type GoodAmountInputFieldProps = {
  amount: number
  unit: string
  updateAmount: (amount: number) => any
}

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      width: 80
    }
  })
)

export const GoodAmountInputField: React.FC<GoodAmountInputFieldProps> = ({ amount, unit, updateAmount }) => {
  const classes = useStyles()
  const [newAmount, setNewAmount] = React.useState(amount.toString())
  return (
    <TextField
      className={classes.input}
      value={newAmount}
      onChange={event => setNewAmount(event.target.value)}
      onBlur={() => updateAmount(isNaN(parseInt(newAmount)) ? 0 : parseInt(newAmount))}
      InputProps={{
        placeholder: 'Menge',
        endAdornment: <InputAdornment position="end">{unit}</InputAdornment>
      }}
    />
  )
}
