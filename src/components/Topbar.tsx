import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { auth } from './firebase/firebase'
import { useFirebaseUser } from './firebase/hooks'

type TopbarPropTypes = {
  drawerWidth: number
  handleDrawerToggle: () => void
}

const useStyles = makeStyles<Theme, TopbarPropTypes>(theme =>
  createStyles({
    appBar: ({ drawerWidth }) => ({
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`
      }
    }),
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      }
    },
    title: {
      flexGrow: 1
    }
  })
)

const SignOutButton: React.FunctionComponent = () => (
  <Button color="inherit" onClick={() => auth.signOut()}>
    Abmelden
  </Button>
)

export const Topbar: React.FunctionComponent<TopbarPropTypes> = props => {
  const classes = useStyles(props)
  const user = useFirebaseUser()

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          className={classes.menuButton}
          onClick={props.handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Vorratskammer
        </Typography>
        {user && <SignOutButton />}
      </Toolbar>
    </AppBar>
  )
}
