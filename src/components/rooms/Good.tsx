import { createStyles, makeStyles } from '@material-ui/core/styles'

import InputAdornment from '@material-ui/core/InputAdornment'
import React from 'react'
import { RoomGoodType } from './GoodsList'
import { TextField } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { firestore } from '../firebase/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      width: 80
    }
  })
)

type GoodType = {
  _id: string
  name: string
  unit: string
}

type GoodUnitInputFieldProps = {
  amount: number
  unit: string
  updateAmount: (amount: number) => Promise<void>
}
const GoodUnitInputField: React.FC<GoodUnitInputFieldProps> = ({ amount, unit, updateAmount }) => {
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

type GoodListEntryProps = {
  goodData: RoomGoodType
  setGoodAmount: (id: string) => (amount: number) => Promise<void>
}

export const GoodListEntry: React.FC<GoodListEntryProps> = ({ goodData, setGoodAmount }) => {
  const document = firestore.doc(`/goods/${goodData.ref.id}`)
  const [good, loading, error] = useDocumentData<GoodType>(document, {
    idField: '_id'
  })
  if (error) return <li>Fehler: {error.message}</li>
  if (loading || !good) return null
  return (
    <Typography>
      {good.name} -{' '}
      <GoodUnitInputField amount={goodData.amount} updateAmount={setGoodAmount(goodData._id)} unit={good.unit} />
    </Typography>
  )
}
