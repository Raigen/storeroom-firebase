import { Theme, createStyles, makeStyles } from '@material-ui/core'

import { GoodEntry } from './GoodEntry'
import { GoodListEntry } from './Good'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { firestore } from '../firebase/firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

export type RoomGoodType = {
  _id: string
  ref: firebase.firestore.DocumentReference
  amount: number
}

export type GoodsListProps = {
  path: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'grid',
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: 'repeat(3, 1fr)'
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(8, 1fr)'
      },
      [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: 'repeat(10, 1fr)'
      },
      gridGap: theme.spacing(3)
    },
    item: {
      gridColumnEnd: 'span 1'
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing(1)
    }
  })
)

export const GoodsList: React.FC<GoodsListProps> = ({ path }) => {
  const classes = useStyles()
  const [goods, loading, error] = useCollectionData<RoomGoodType>(firestore.collection(`${path}/goods`), {
    idField: '_id'
  })

  const setAmount = React.useCallback(
    (id: string) => async (newAmount: number) => {
      const document = firestore.doc(`${path}/goods/${id}`)
      await document.update('amount', newAmount)
    },
    [path]
  )

  if (error) return <div>Fehler: {error.message}</div>
  if (loading || !goods) return null
  return (
    <>
      <div className={classes.container}>
        {goods.map(good => (
          <div className={classes.item} key={good._id}>
            <Paper className={classes.paper}>
              <GoodListEntry goodData={good} setGoodAmount={setAmount} />
            </Paper>
          </div>
        ))}
      </div>
      <GoodEntry path={path} />
    </>
  )
}
