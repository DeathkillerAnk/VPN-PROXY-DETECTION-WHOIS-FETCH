import React, { Component } from 'react';
import './advance.css'
import { Paper, Grid, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { SearchRounded as SearchIcon } from "@material-ui/icons";

export default class Advance extends Component {


    constructor(props) {
        super(props)
        this.state = {
            advancesearch: '',
            searchResult: [],
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const searchdata = this.state
        console.log(searchdata)
    }
    handleInputChange = (event => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    })
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
                    <Grid item xs={12}>
                        <Paper variant="outlined">
                            <div classname="vpndetails" >
                                {searchResult.map((Data) =>
                                    <div className="detailscard">
                                        <div className="d1">
                                            <p>Protocol : {Data.item.protocol}</p>
                                            <p>Portid : {Data.item.portid}</p>

                                        </div>

                                        <div className="d2">
                                            <p>State: {Data.state[0].item.state}</p>
                                            <p>Service name : {Data.service[0].item.name}</p>
                                        </div>
                                    </div>
                                )}</div>
                        </Paper>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}