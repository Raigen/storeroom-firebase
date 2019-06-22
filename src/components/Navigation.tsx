import { LANDING, ROOMLIST, SIGN_IN, SIGN_UP } from '../constants/routes'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import Drawer from '@material-ui/core/Drawer'
import Link from '@material-ui/core/Link'
import React from 'react'
import List from '@material-ui/core/List'

import { Link as RouterLink } from 'react-router-dom'
import { useFirebaseUser } from './firebase/hooks'

type NavigationPropTypes = {
  drawerWidth: number
}

const useStyles = makeStyles<Theme, NavigationPropTypes>(theme =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    drawer: ({ drawerWidth }) => ({
      width: drawerWidth,
      flexShrink: 0
    }),
    drawerPaper: ({ drawerWidth }) => ({
      width: drawerWidth
    })
  })
)

const MenuItem: React.FC<{ to: string; text: string }> = ({ to, text }) => (
  <ListItem>
    <ListItemText
      primary={
        <Link component={RouterLink} to={to}>
          {text}
        </Link>
      }
    />
  </ListItem>
)

export const Navigation: React.FunctionComponent<NavigationPropTypes> = props => {
  const classes = useStyles(props)
  const user = useFirebaseUser()
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.toolbar} />
      <List>
        {user ? (
          <>
            <MenuItem to={LANDING} text="Home" />
            <MenuItem to={ROOMLIST} text="Liste" />
          </>
        ) : (
          <>
            <MenuItem to={SIGN_UP} text="Registrieren" />
            <MenuItem to={SIGN_IN} text="Anmelden" />
          </>
        )}
      </List>
    </Drawer>
  )
}
