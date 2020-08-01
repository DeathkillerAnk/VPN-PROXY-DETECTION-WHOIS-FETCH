import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from "@material-ui/core";
import { LoadingContext } from "../../Context/LoadingContext";

const useStyles = makeStyles((theme) => ({

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));
export default function Spinner() {
    const classes = useStyles();
    const loadingContextValues = useContext(LoadingContext);

    return (
        <Backdrop className={classes.backdrop} open={loadingContextValues.isLoading} onClick={() => loadingContextValues.hideSpinner()}>
            <CircularProgress color="inherit" />
        </Backdrop >
    );
}