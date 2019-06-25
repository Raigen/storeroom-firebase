import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import { GOODLIST } from '../constants/routes'
import Link from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'
import { RoomsList } from './rooms/RoomList'
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
        {user && <RoomsList />}
        <Divider />
        <ListItem>
          <ListItemText
            primary={
              <Link component={RouterLink} to={GOODLIST}>
                Waren
              </Link>
            }
          />
        </ListItem>
      </List>
    </Drawer>
  )
}
