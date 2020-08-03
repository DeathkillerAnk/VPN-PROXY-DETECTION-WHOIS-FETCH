import React, { Component } from 'react';
import './advance.css'
import { Paper, Grid, TextField, InputAdornment, IconButton, Typography } from '@material-ui/core';
import { SearchRounded as SearchIcon } from "@material-ui/icons";
import axios from 'axios';
import { LoadingContext } from '../Context/LoadingContext';
export default class Advance extends Component {

    static contextType = LoadingContext;
    constructor(props) {
        super(props)
        this.state = {
            advancesearch: '',
            searchResult: [],
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
                                        this.handleSubmit();
                                        ev.preventDefault();
                                    }
                                }}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton onClick={this.handleSubmit}>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper variant="outlined" className="p-2">
                            <Typography className="text-center" variant="h5">Port Scan Detials</Typography>
                            {this.state.nmapData.ports.map((nmap) =>
                                <div className="detailscard">
                                    <div className="d1">
                                        <p>Protocol : {nmap.item.protocol}</p>
                                        <p>Portid : {nmap.item.portid}</p>

                                    </div>

                                    <div className="d2">
                                        <p>State: {nmap.state[0].item.state}</p>
                                        <p>Service name : {nmap.service[0].item.name}</p>
                                    </div>
                                </div>

                            )}

                        </Paper>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}