import { LANDING, ROOMLIST, SIGN_IN } from '../constants/routes'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'
import { Navigation } from './Navigation'
import React from 'react'
import { RoomsList } from './rooms/RoomList'
import { SignIn } from './auth/SignIn'
import { Topbar } from './Topbar'
import Typography from '@material-ui/core/Typography'

function Home() {
  return <Typography>Home</Typography>
}

const drawerWidth = 240
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
          <Route path={ROOMLIST} component={RoomsList} />
          <Route path={SIGN_IN} component={SignIn} />
        </main>
      </div>
    </Router>
  )
}
