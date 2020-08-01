import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import  { LoadingContext } from "../../Context/LoadingContext";

export default function SnackBar() {
    const loadingContextValues = useContext(LoadingContext);
    const handleClose = () => {
        loadingContextValues.hideSnackBar()
    };

    return (<Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        open={loadingContextValues.isSnackBarVisible}
        autoHideDuration={6000}
        onClose={handleClose}
        message={loadingContextValues.message}
        action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        }
    />);
}