import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavigationDrawer from './components/NavigationDrawer'
import Vpndetector from './components/VpnDetection/vpndetector'
import Whois from './components/Whois/whois'
import Advance from './components/advance'
import LoadingContextProvider from "./Context/LoadingContext";
import Spinner from "./components/Feedbacks/Spinner";
import SnackBar from "./components/Feedbacks/SnackBar";
import axios from 'axios';
import './App.css'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

}));
function App() {
  const classes = useStyles();
  axios.defaults.baseURL = 'http://localhost:5000';
  return (
    <Router>
      <div className={classes.root}>
        <NavigationDrawer />
        <LoadingContextProvider >
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Route path="/" exact component={Vpndetector} />
            <Route path="/whois" exact component={Whois} />
            <Route path="/advancesearch" exact component={Advance} />
          </main>
          <Spinner />
          <SnackBar/>
        </LoadingContextProvider>

      </div>
    </Router>

  );
}

export default App;
