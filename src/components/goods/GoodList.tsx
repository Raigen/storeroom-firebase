import { GoodListEntry, GoodType } from './Good'

import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import { firestore } from '../firebase/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const GoodInput: React.FC = () => {
  const [name, setName] = React.useState('')
  const [unit, setUnit] = React.useState('')

  const saveNewEntry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await firestore.collection('goods/').add({ name, unit })
    setName('')
    setUnit('')
  }

  return (
    <form onSubmit={saveNewEntry} data-testid="goodForm">
      <TextField required value={name} onChange={event => setName(event.target.value)} placeholder="Zucker" />
      <TextField required value={unit} onChange={event => setUnit(event.target.value)} placeholder="kg" />
      <Button type="submit">Speichern</Button>
    </form>
  )
}

type ListProps = {}

export const GoodList: React.FC<ListProps> = () => {
  const [goods, loading, error] = useCollectionData<GoodType>(firestore.collection('/goods'), {
    idField: '_id'
  })
  if (error) return <div>Fehler: {error.message}</div>
  if (loading || !goods) return null

  const deleteEntry = async (id: string) => {
    await firestore.collection('goods/').doc(id).delete()
  }


  return (
    <List>
      {goods.map(good => (
        <ListItem dense key={good._id}>
          <ListItemText primary={<GoodListEntry good={good} onDelete={deleteEntry} />} />
        </ListItem>
      ))}
      <ListItem dense>
        <GoodInput />
      </ListItem>
    </List>
  )
}
