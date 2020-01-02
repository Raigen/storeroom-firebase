import { GOODLIST, INVITATIONLIST, LANDING, NEW_HOUSEHOLD, ROOM, SIGN_IN } from '../constants/routes'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'
import { GoodList } from './goods/GoodList'
import { HomeIntro } from './HomeIntro'
import { HouseholdForm } from './household/HouseholdForm'
import { InvitationList } from './invitations/InvitationList'
import { Navigation } from './Navigation'
import React from 'react'
import { Room } from './rooms/Room'
import { SignIn } from './auth/SignIn'
import { Topbar } from './Topbar'

const drawerWidth = 200
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    root: {
      display: 'flex'
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3)
    }
  })
)

export const App: React.FC = () => {
  const classes = useStyles()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const toggleDrawer = () => setMobileOpen(!mobileOpen)
  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Topbar drawerWidth={drawerWidth} handleDrawerToggle={toggleDrawer} />
        <Navigation drawerWidth={drawerWidth} isMobileOpen={mobileOpen} handleDrawerToggle={toggleDrawer} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Route path={LANDING} exact component={HomeIntro} />
          <Route path={ROOM} component={Room} />
          <Route path={GOODLIST} component={GoodList} />
          <Route path={SIGN_IN} component={SignIn} />
          <Route path={NEW_HOUSEHOLD} component={HouseholdForm} />
          <Route path={INVITATIONLIST} component={InvitationList} />
        </main>
      </div>
    </Router>
  )
}
