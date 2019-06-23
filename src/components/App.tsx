import { LANDING, ROOM, SIGN_IN } from '../constants/routes'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'
import { Navigation } from './Navigation'
import React from 'react'
import { Room } from './rooms/Room'
import { SignIn } from './auth/SignIn'
import { Topbar } from './Topbar'
import Typography from '@material-ui/core/Typography'

function Home() {
  return <Typography>Home</Typography>
}

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

export const App = () => {
  const classes = useStyles()
  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Topbar drawerWidth={drawerWidth} />
        <Navigation drawerWidth={drawerWidth} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Route path={LANDING} exact component={Home} />
          <Route path={ROOM} component={Room} />
          <Route path={SIGN_IN} component={SignIn} />
        </main>
      </div>
    </Router>
  )
}
