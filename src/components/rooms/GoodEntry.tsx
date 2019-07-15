import { Autosuggest, Suggestion } from '../Autosuggest/Autosuggest'

import Button from '@material-ui/core/Button'
import { GoodAmountInputField } from './GoodAmountInputField'
import React from 'react'
import { firestore } from '../firebase/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'

type GoodDataType = {
  name: string
  unit: string
  amount: number
  ref?: firebase.firestore.DocumentReference
}

const emptyGoodData: GoodDataType = { name: '', amount: 0, unit: '', ref: undefined }

type GoodEntryProps = {
  path: string
  initialGoodData?: GoodDataType
}

export const GoodEntry: React.FC<GoodEntryProps> = ({ path, initialGoodData = emptyGoodData }) => {
  const goodsCollection = React.useMemo(() => firestore.collection('goods/'), [])
  const [goodData, setGoodData] = React.useState<GoodDataType>(initialGoodData)
  // fetch list of all available goods
  const [goods, loading, error] = useCollection(goodsCollection)

  // list of all good names with ref
  const goodSuggestion: Suggestion[] = goods
    ? goods.docs.map(good => ({ name: good.data().name, unit: good.data().unit, ref: good.ref }))
    : []
  // list of all good units with ref
  const unitSuggestion: Suggestion[] = goods ? goods.docs.map(good => ({ name: good.data().unit })) : []

  const handleSave = async () => {
    const roomGoodsCollection = firestore.collection(`${path}/goods`)
    // use existing good or create a new one
    const newGood = goodData.ref || (await goodsCollection.add({ name: goodData.name, unit: goodData.unit }))
    // add good to the room
    await roomGoodsCollection.add({ amount: goodData.amount, ref: newGood })
    // reset form data
    setGoodData(emptyGoodData)
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
