import React, { Component } from 'react'
export const LoadingContext = React.createContext();
export default class LoadingContextProvider extends Component {
    state = {
        isLoading: false,
        isSnackBarVisible: false,
        message: ""
    }
    showSpinner = () => {
        this.setState({ isLoading: true })
    }
    hideSpinner = () => {
        this.setState({ isLoading: false })
    }
    showSnackBar = (message) => {
        this.setState({ isSnackBarVisible: true, message: message });
    }
    hideSnackBar = () => {
        this.setState({ isSnackBarVisible: false, message: "" });
    }
    render() {
        return (
            <LoadingContext.Provider value={{ ...this.state, showSpinner: this.showSpinner, hideSpinner: this.hideSpinner, showSnackBar: this.showSnackBar, hideSnackBar: this.hideSnackBar }}>
                {this.props.children}
            </LoadingContext.Provider>
        );
    }
}