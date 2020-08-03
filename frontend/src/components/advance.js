import React, { Component } from 'react';
import './advance.css'
import { Paper, Grid, TextField, InputAdornment, IconButton, Typography, Button } from '@material-ui/core';
import { SearchRounded as SearchIcon } from "@material-ui/icons";
import axios from 'axios';
import { LoadingContext } from '../Context/LoadingContext';
export default class Advance extends Component {

    static contextType = LoadingContext;
    constructor(props) {
        super(props)
        this.state = {
            advancesearch: '',
            searchResult: '',
            nmapData: { status: "", ports: [] },

        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.fetchNmapData();
    }
    handleInputChange = (event => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    })
    quickScan = async (ip) => {
        try {
            this.context.showSpinner();
            const { data, status } = await axios.post('/api/advancedsearch/quickscan', { host: this.state.advancesearch }, { validateStatus: () => true });
            this.context.hideSpinner();
            if (status !== 200) {
                this.context.showSnackBar(data.msg);
                return;
            }
            this.setState({ searchResult: data });
        } catch (error) {

        }
    }
    fullScan = async (ip) => {
        try {
            this.context.showSpinner();
            const { data, status } = await axios.post('/api/advancedsearch/quickscan', { host: this.state.advancesearch }, { validateStatus: () => true });
            this.context.hideSpinner();
            if (status !== 200) {
                this.context.showSnackBar(data.msg);
                return;
            }
            this.setState({ searchResult: data });
        } catch (error) {

        }
    }
    fetchNmapData = async (ip) => {
        try {
            this.context.showSpinner();
            const { data, status } = await axios.post('/api/vpndetect/vpnports', { host: this.state.advancesearch }, { validateStatus: () => true });
            this.context.hideSpinner();
            if (status !== 200) {
                this.context.showSnackBar(data.msg);
                return;
            }
            this.setState({ nmapData: data });
            this.context.showSnackBar("Port scanning done");
        } catch (error) {
            this.context.hideSpinner();
            this.context.showSnackBar("Error occured while scanning ports");
        }

    }
    render() {

        const { advancesearch, searchResult } = this.state
        return (
            <React.Fragment>
                <Grid container >
                    <Grid item xs={12}>
                        <div className="py-3 text-center">
                            <TextField
                                name="advancesearch"
                                variant="outlined"
                                className="w-90"
                                style={{ backgroundColor: "white" }}
                                label="Enter IP or Host"
                                value={advancesearch}
                                onChange={this.handleInputChange}
                                onKeyPress={(ev) => {
                                    if (ev.key === 'Enter') {
                                        this.quickScan(this.state.advancesearch)
                                        ev.preventDefault();
                                    }
                                }}

                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} className="text-center">
                        <Button variant="contained" color="primary" onClick={this.quickScan.bind(this, this.state.searchResult)}>Quick Scan</Button>
                    </Grid>
                    <Grid item xs={12} sm={6} className="text-center">
                        <Button variant="contained" color="primary" onClick={this.fullScan.bind(this, this.state.searchResult)}>Full Scan</Button>
                    </Grid>
                    <Grid item xs={12} className="mt-3">
                        <Paper variant="outlined" className="p-2">
                            <Typography variant="h5">Results</Typography>
                            <pre style={{ fontSize: "1rem" }}>
                                {JSON.stringify(this.state.searchResult, null, 4)}

                            </pre>
                        </Paper>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}