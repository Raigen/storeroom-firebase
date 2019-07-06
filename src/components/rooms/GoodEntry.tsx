import { Autosuggest, Suggestion } from '../Autosuggest/Autosuggest'

import { Button } from '@material-ui/core'
import { GoodAmountInputField } from './GoodAmountInputField'
import React from 'react'
import { firestore } from '../firebase/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'

type GoodEntryProps = {
  path: string
}

export const GoodEntry: React.FC<GoodEntryProps> = ({ path }) => {
  const [goodData, setGoodData] = React.useState<{
    name: string
    unit: string
    amount: number
    ref?: firebase.firestore.DocumentReference
  }>({ name: '', amount: 0, unit: '' })
  // fetch list of all available goods
  const [goods, , loading] = useCollection(firestore.collection('goods/'))

  // list of all good names with ref
  const goodSuggestion: Suggestion[] = goods
    ? goods.docs.map(good => ({ name: good.data().name, unit: good.data().unit, ref: good.ref }))
    : []
  // list of all good units with ref
  const unitSuggestion: Suggestion[] = goods ? goods.docs.map(good => ({ name: good.data().unit })) : []

  const handleSave = async () => {
    // use existing good or create a new one
    const newGood =
      goodData.ref || (await firestore.collection('goods/').add({ name: goodData.name, unit: goodData.unit }))
    // add good to the room
    await firestore.collection(`${path}/goods`).add({ amount: goodData.amount, ref: newGood })
    // reset form data
    setGoodData({ name: '', unit: '', amount: 0, ref: undefined })
  }

  const isFormValid = React.useMemo<boolean>(() => {
    return goodData.name.length > 3 && Boolean(goodData.amount) && goodData.unit.length > 0
  }, [goodData])

  return (
    <>
      <Autosuggest
        suggestions={goodSuggestion}
        placeholder={loading ? 'Laden...' : 'Milch'}
        onChange={value => setGoodData(prev => ({ ...prev, ...value }))}
      />
      <GoodAmountInputField
        amount={goodData.amount}
        unit={goodData.unit}
        updateAmount={amount => setGoodData(prev => ({ ...prev, amount }))}
      />
      {goodData.ref ? null : (
        <Autosuggest
          suggestions={unitSuggestion}
          placeholder={loading ? 'Laden...' : 'kg'}
          onChange={value => setGoodData(prev => ({ ...prev, unit: value.name }))}
        />
      )}
      <Button onClick={handleSave} disabled={!isFormValid}>
        Hinzufügen
      </Button>
    </>
  )
}
