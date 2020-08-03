
import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useLocation, useHistory } from "react-router-dom";
import { VpnKeyRounded as VpnIcon, SearchRounded as WhoisIcon, LocationSearchingRounded as AdvanceSearchIcon, TimelineRounded as AnalyticsIcon, DoneAllRounded as BatchProcessIcon } from "@material-ui/icons"
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function NavigationDrawer(props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    let location = useLocation();
    let history = useHistory();

    let title = location.pathname.slice(1);
    // Changing the title ====================
    if (title == 'advancesearch')
        title = 'Advance Search';
    if (title == 'whois')
        title = 'Whois Fetch';
    if (title == 'batchprocess')
        title = 'Batch Processes'
    if (title == 'analytics')
        title = 'Analytics'

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const routeTo = (route) => {
        history.push(route);
    }

    const menuItems = [{ text: "VPN/Proxy Detector", path: "/", icon: <VpnIcon /> }, { text: "Whois Fetch", path: "/whois", icon: <WhoisIcon /> }, { text: "Advance Scan", path: "/advancesearch", icon: <AdvanceSearchIcon /> }, { text: "Analytics", path: "/analytics", icon: <AnalyticsIcon /> }, { text: "Batch Processes", path: "/batchprocess", icon: <BatchProcessIcon /> }];


    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <List>
                {
                    menuItems.map((item, index) => (
                        <ListItem button key={index} onClick={routeTo.bind(this, item.path)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))
                }
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        CodeOnSteroids  - {title ? title : "Vpn/Proxy Detector"}
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
        </React.Fragment>
    );

}