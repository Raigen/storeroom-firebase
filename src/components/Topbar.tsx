import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { useFirebaseUser } from './firebase/hooks'
import { auth } from './firebase/firebase'

type TopbarPropTypes = {
  drawerWidth: number
}

const useStyles = makeStyles<Theme, TopbarPropTypes>(theme =>
  createStyles({
    appBar: ({ drawerWidth }) => ({
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }),
    title: {
      flexGrow: 1
    }
  })
)

const SignOutButton: React.FunctionComponent = () => <Button onClick={() => auth.signOut()}>Abmelden</Button>

export const Topbar: React.FunctionComponent<TopbarPropTypes> = props => {
  const classes = useStyles(props)
  const user = useFirebaseUser()

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Vorratskammer
        </Typography>
        {user && <SignOutButton />}
      </Toolbar>
    </AppBar>
  )
}
