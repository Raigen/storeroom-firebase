import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import { GOODLIST } from '../constants/routes'
import Hidden from '@material-ui/core/Hidden'
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
  isMobileOpen: boolean
  handleDrawerToggle: () => void
}

const useStyles = makeStyles<Theme, NavigationPropTypes>(theme =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    drawer: ({ drawerWidth }) => ({
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    }),
    drawerPaper: ({ drawerWidth }) => ({
      width: drawerWidth
    })
  })
)

export const Navigation: React.FunctionComponent<NavigationPropTypes> = props => {
  const classes = useStyles(props)
  const user = useFirebaseUser()
  const { isMobileOpen, handleDrawerToggle } = props
  const drawer = (
    <>
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
    </>
  )
  return (
    <nav className={classes.drawer}>
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={isMobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  )
}
