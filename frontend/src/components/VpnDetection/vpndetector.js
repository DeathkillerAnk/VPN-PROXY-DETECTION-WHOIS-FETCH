import React, { Component } from 'react';

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Container, TextField, IconButton, InputAdornment, Grid, Paper } from '@material-ui/core';
import { SearchRounded as SearchIcon } from "@material-ui/icons";
import { LoadingContext } from "../../Context/LoadingContext"
import "./vpndetector.css"
import axios from 'axios';

const percentage = 70;

export default class Vpndetector extends Component {
    static contextType = LoadingContext;
    constructor(props) {
        super(props)
        this.state = {
            vpnsearch: '',
            mapCity: 'CHAMPA',
            vpnValue: 0
        }
    }

    handleSubmit = () => {
        console.log("Running");
        this.fetchIpResults(this.state.vpnsearch);
        this.checkVpn(this.state.vpnsearch);
    }

    handleInputChange = (event => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    })
    checkVpn = async (ip) => {
        try {
            const response = await axios.post('/api/vpndetect/checkip', { host: this.state.vpnsearch }, { validateStatus: () => true });
            const { data, status } = response;
            this.context.hideSpinner();
            if (status !== 200) {
                this.context.showSnackBar(data.msg);
                return;
            }
            this.context.showSnackBar("All done")
            let tempVpnValue = data.checkIp == 'true' ? 1 : 0;
            tempVpnValue *= 100;
            this.setState({ vpnValue: tempVpnValue });
        }
        catch (err) {
            console.log({ ...err });
            this.context.hideSpinner();
            this.context.showSnackBar("Some error occured");
        }
    }
    fetchIpResults = (ip) => {
        this.context.showSpinner();
        fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,proxy,query`)
            .then(response => response.json())
            .then(data => {
                if (data.message && data.status == 'fail') {
                    this.context.showSnackBar("Entered IP address is not valid.");
                    this.context.hideSpinner();
                    return;
                }
                const ip = data.query
                const country = data.country
                const regionName = data.regionName
                const city = data.city
                const zip = data.zip
                const isp = data.isp
                const timezone = data.timezone
                const lat = data.lat
                const lon = data.lon
                document.getElementById("ip").innerHTML = (ip);
                document.getElementById("country").innerHTML = (country);
                document.getElementById("regionName").innerHTML = (regionName);
                document.getElementById("city").innerHTML = (city);
                document.getElementById("zip").innerHTML = (zip);
                document.getElementById("isp").innerHTML = (isp);
                document.getElementById("timezone").innerHTML = (timezone);
                document.getElementById("lat").innerHTML = (lat);
                document.getElementById("lon").innerHTML = (lon);
                this.setState({ mapCity: city })
                this.context.hideSpinner();
                this.context.showSnackBar("Done");
            })
    }

    render() {
        const { vpnsearch } = this.state
        return (
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className="text-center pt-3">
                            <TextField
                                name="vpnsearch"
                                variant="outlined"
                                className="w-90"
                                style={{ backgroundColor: "white" }}
                                label="Enter Ip or Host"
                                value={vpnsearch}
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
                        <div className="text-center py-2">
                            <div className="meterbox mr-auto ml-auto">
                                <CircularProgressbar
                                    value={this.state.vpnValue}
                                    text={`${this.state.vpnValue}%`}
                                    styles={buildStyles({
                                        pathColor: "rgba(0, 0, 51,0.7)",
                                        textColor: 'rgba(0, 0, 51,0.7)',
                                        trailColor: '#d6d6d6',
                                        backgroundColor: 'rgb(205, 78, 226)',
                                        rotation: 0.5 + (1 - this.state.vpnValue / 100) / 2
                                    })}
                                />

                                <p>Percentage</p>

                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} >

                        <Paper className="p-1">
                            <table className="vpntable">
                                <tr>
                                    <th>IP</th>
                                    <td id="ip"></td>
                                </tr>
                                <tr>
                                    <th>Country</th>
                                    <td id="country"></td>
                                </tr>
                                <tr>
                                    <th>State</th>
                                    <td id="regionName"></td>
                                </tr>

                                <tr>
                                    <th>City</th>
                                    <td id="city"></td>
                                </tr>
                                <tr>
                                    <th>ZIP</th>
                                    <td id="zip"></td>
                                </tr>
                                <tr>
                                    <th>ISP</th>
                                    <td id="isp"></td>
                                </tr>
                                <tr>
                                    <th>Timezone</th>
                                    <td id="timezone"></td>
                                </tr>
                                <tr>
                                    <th>Latitude</th>
                                    <td id="lat"></td>
                                </tr>
                                <tr>
                                    <th>Longitude</th>
                                    <td id="lon"></td>
                                </tr>
                            </table>
                        </Paper>

                    </Grid>
                    <Grid item xs={12} md={6}>

                        <div id="map-container-google-1" class="z-depth-1-half map-container h-100" >
                            <iframe title="Maps" width="100%" height="100%" src={`https://maps.google.com/maps?q=${this.state.mapCity}&t=&z=13&ie=UTF8&iwloc=&output=embed`} frameborder="0"
                                allowfullscreen></iframe>
                        </div>

                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                </Grid>
            </Container>
        );
    }
}

