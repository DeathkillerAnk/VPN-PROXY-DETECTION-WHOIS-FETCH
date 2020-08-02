import React, { Component } from 'react';

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Container, TextField, IconButton, InputAdornment, Grid, Paper, Typography, CircularProgress, Chip, Button } from '@material-ui/core';
import { SearchRounded as SearchIcon, PrintRounded as PrintIcon } from "@material-ui/icons";
import { LoadingContext } from "../../Context/LoadingContext"
import "./vpndetector.css"
import axios from 'axios';


export default class Vpndetector extends Component {
    static contextType = LoadingContext;
    constructor(props) {
        super(props)
        this.state = {
            vpnsearch: '',
            mapCity: 'CHAMPA',
            ipDetails: {},
            result: {
                vpnValue: 0,
                ipType: "", //Good or bad
                ipTypeColor: "", //green for good, red for bad
            },
            nmapData: { status: "", ports: [] },
            feedbackData: {
                showCheckIpSpinner: false,
                showCheckCidrSpinner: false,
                showCheckThirdPartyDatasetSpinner: false,
                showMLModel1Spinner: false,
                showMLModel2Spinner: false,

                checkIpValue: 0,
                checkCidrValue: 0,
                checkThirdPartyDatasetValue: 0,
                checkMLModel1Value: 0,
                checkMLModel2Value: 0,

                areModulesRunning: false,
                isResultFetched: true
            }
        }
    }

    toSentenceCase = (s) => {
        let result = s.replace(/([-_][a-z])/ig, ($1) => {
            return $1.toUpperCase()
                .replace('-', '')
                .replace('_', ' ');
        });
        return result.charAt(0) + result.slice(1);
    };

    handleSubmit = () => {
        console.log("Running");
        this.fetchIpAdvancedDetails(this.state.vpnsearch);
        this.fetchNmapData(this.state.vpnsearch);
        this.checkVpn(this.state.vpnsearch);

    }

    handleInputChange = (event => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    });

    fetchNmapData = async (ip) => {
        try {
            this.context.showSpinner();
            const { data, status } = await axios.post('/api/vpndetect/vpnports', { host: this.state.vpnsearch }, { validateStatus: () => true });
            this.context.hideSpinner();
            if (status !== 200) {
                this.context.showSnackBar(data.msg);
                return;
            }
            this.setState({ nmapData: data });
            if (data.status == "Host is down") {
                let feedbackData = { ...this.state.feedbackData };
                feedbackData.checkMLModel2Value = "Couldn't find";
                this.setState({ feedbackData: feedbackData })
            }
            this.context.showSnackBar("Port scanning done");
        } catch (error) {
            this.context.showSnackBar("Error occured while scanning ports");
        }

    }

    checkCidr = async (ip) => {
        try {
            let feedbackData = this.state.feedbackData;
            feedbackData.showCheckCidrSpinner = true;
            this.setState({ feedbackData: feedbackData });

            const response = await axios.post('/api/vpndetect/checkcidr', { host: this.state.vpnsearch }, { validateStatus: () => true });
            const { data, status } = response;

            feedbackData = { ...this.state.feedbackData };
            feedbackData.showCheckCidrSpinner = false;
            this.setState({ feedbackData: feedbackData });

            if (status !== 200) {
                this.context.showSnackBar(data.msg);
                return;
            }

            feedbackData.checkCidrValue = data.result;
            feedbackData.showCheckCidrSpinner = false;
            this.setState({ feedbackData: feedbackData });
            return feedbackData.checkCidrValue;
        } catch (error) {
            let feedbackData = { ...this.state.feedbackData };
            feedbackData.showCheckCidrSpinner = false;
            this.setState({ feedbackData: feedbackData });
            throw error;
        }
    }

    checkIp = async (ip) => {
        try {
            let feedbackData = this.state.feedbackData;
            feedbackData.showCheckIpSpinner = true;
            this.setState({ feedbackData: feedbackData });

            const response = await axios.post('/api/vpndetect/checkip', { host: this.state.vpnsearch }, { validateStatus: () => true });
            const { data, status } = response;

            feedbackData = { ...this.state.feedbackData };
            feedbackData.showCheckIpSpinner = false;
            this.setState({ feedbackData: feedbackData });

            if (status !== 200) {
                this.context.showSnackBar(data.msg);
                return;
            }

            feedbackData.checkIpValue = data.result;
            feedbackData.showCheckIpSpinner = false;
            this.setState({ feedbackData: feedbackData });
            return feedbackData.checkIpValue;
        } catch (error) {
            let feedbackData = { ...this.state.feedbackData };
            feedbackData.showCheckIpSpinner = false;
            this.setState({ feedbackData: feedbackData });
            throw error;
        }
    }

    checkThirdPartyDataset = async (ip) => {
        try {
            let feedbackData = this.state.feedbackData;
            feedbackData.showCheckThirdPartyDatasetSpinner = true;
            this.setState({ feedbackData: feedbackData });

            const response = await axios.post('/api/vpndetect/checkonlinedata', { host: this.state.vpnsearch }, { validateStatus: () => true });
            const { data, status } = response;

            feedbackData = { ...this.state.feedbackData };
            feedbackData.showCheckThirdPartyDatasetSpinner = false;
            this.setState({ feedbackData: feedbackData });

            if (status !== 200) {
                this.context.showSnackBar(data.msg);
                return;
            }

            feedbackData.checkThirdPartyDatasetValue = data.result;
            feedbackData.showCheckThirdPartyDatasetSpinner = false;
            this.setState({ feedbackData: feedbackData });
            return feedbackData.checkThirdPartyDatasetValue;
        } catch (error) {
            let feedbackData = { ...this.state.feedbackData };
            feedbackData.showCheckThirdPartyDatasetSpinner = false;
            this.setState({ feedbackData: feedbackData });
            throw error;
        }
    }

    checkMLModel1 = async (ip) => {
        try {
            let feedbackData = this.state.feedbackData;
            feedbackData.showMLModel1Spinner = true;
            this.setState({ feedbackData: feedbackData });

            const response = await axios.post('/api/vpndetect/intelscore', { host: this.state.vpnsearch }, { validateStatus: () => true });
            const { data, status } = response;

            feedbackData = { ...this.state.feedbackData };
            feedbackData.showMLModel1Spinner = false;
            this.setState({ feedbackData: feedbackData });

            if (status !== 200) {
                this.context.showSnackBar(data.msg);
                return;
            }

            feedbackData = { ...this.state.feedbackData };
            feedbackData.checkMLModel1Value = data.result;
            feedbackData.showMLModel1Spinner = false;
            this.setState({ feedbackData: feedbackData });
            return feedbackData.checkMLModel1Value;
        } catch (error) {
            let feedbackData = { ...this.state.feedbackData };
            feedbackData.showMLModel1Spinner = false;
            this.setState({ feedbackData: feedbackData });
            throw error;
        }
    }

    checkMLModel2 = async (ip) => {
        try {
            let feedbackData = this.state.feedbackData;
            feedbackData.showMLModel2Spinner = true;
            this.setState({ feedbackData: feedbackData });

            const response = await axios.post('/api/vpndetect/qualityscore', { host: this.state.vpnsearch }, { validateStatus: () => true });
            const { data, status } = response;

            feedbackData = { ...this.state.feedbackData };
            feedbackData.showMLModel2Spinner = false;
            this.setState({ feedbackData: feedbackData });

            if (status !== 200) {
                this.context.showSnackBar(data.msg);
                return;
            }

            feedbackData.checkMLModel2Value = data.result.vpn ? 1 : 0;
            console.log(data);
            feedbackData.showMLModel2Spinner = false;
            this.setState({ feedbackData: feedbackData });
            return feedbackData.checkMLModel2Value;
        } catch (error) {
            let feedbackData = { ...this.state.feedbackData };
            feedbackData.showMLModel2Spinner = false;
            this.setState({ feedbackData: feedbackData });
            throw error;
        }
    }


    checkVpn = async (ip) => {
        try {
            const queries = [this.checkIp(ip),this.checkCidr(ip), this.checkMLModel1(ip), this.checkMLModel2(ip), this.checkThirdPartyDataset(ip)];
            const allResponses = await Promise.all(queries);
            // =========== Calculating avg ===============
            let avgValScore = 0;
            let totalN = 0;
            let weights = [1,1, 10, 8, 2]
            console.log(allResponses);
            for (let i = 0; i < allResponses.length; i++) {
                const response = allResponses[i];
                if (response <= 1 || response >= 0) {
                    avgValScore += weights[i] * response;
                    totalN += weights[i];
                }
            }
            if (totalN > 0) {
                avgValScore /= totalN;
            }
            if (isNaN(avgValScore)) {
                avgValScore = 0;
            }
            avgValScore*=100;
            avgValScore = avgValScore.toFixed(2);
            let tempVpnValue = avgValScore ;

            // ============= Changing State ================
            let ipType = tempVpnValue <= 50 ? "Good" : "Bad";
            let ipTypeColor = tempVpnValue < 50 ? "#00ff00" : "#ff0000";
            if (tempVpnValue > 70) {
                ipType = "Bad";
                ipTypeColor = '#ff0000'
            }
            else if (tempVpnValue <= 70 && tempVpnValue > 40) {
                ipType = "Average"
                ipTypeColor = '#0000ff'
            }
            else {
                ipType = "Good"
                ipTypeColor = '#00ff00'
            }

            let feedbackData = { ...this.state.feedbackData };
            feedbackData.isResultFetched = true;
            feedbackData.ipType = ipType;
            feedbackData.ipTypeColor = ipTypeColor;
            this.setState({ result: { vpnValue: tempVpnValue, ipType: ipType, ipTypeColor: ipTypeColor }, feedbackData: feedbackData });
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
                this.context.showSnackBar("IP details fetched");
            })
    }

    fetchIpAdvancedDetails = async (ip) => {
        try {
            this.context.showSpinner();
            const { data, status } = await axios.post('/api/vpndetect/qualityscore', { host: this.state.vpnsearch }, { validateStatus: () => true });
            this.context.hideSpinner();
            delete data.result.transaction;
            delete data.result.connection_type;
            delete data.result.abuse_velocity;
            delete data.result.request_id;
            this.setState({ ipDetails: data.result, mapCity: data.result.city });
        } catch (error) {
            this.context.showSnackBar("Error occured while fetching IP Details")
        }

    }


    printDiv = function (divName) {
        let currentTime = new Date();
        let timeStamp = Date.now()
        window.$('#' + divName).printThis({
            importCSS: true,
            importStyle: true,
            header: `<b>Report</b>- Generated by Code on Steroid IP Forensic app`,
            footer: `<span>Date: ${currentTime.toDateString()} ${currentTime.toTimeString()} </span>&nbsp;&nbsp;<span class="ml-auto">Timestamp:${timeStamp}</span>`,
        });
    }


    render() {
        const { vpnsearch } = this.state
        return (
            <Container id="printarea">
                <Grid container spacing={3}>
                    {/* =================== Search Field ====================== */}
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
                    {/* ================== Meter For Bad Ip result ========================= */}
                    <Grid item xs={12} md={6}>
                        <div className="text-center py-2">
                            <div className="meterbox mr-auto ml-auto">
                                <CircularProgressbar
                                    value={this.state.result.vpnValue}
                                    text={`${this.state.result.vpnValue}%`}
                                    styles={buildStyles({
                                        pathColor: this.state.result.ipTypeColor,
                                        textColor: 'rgba(0, 0, 51,0.7)',
                                        trailColor: '#d6d6d6',
                                        backgroundColor: 'rgb(205, 78, 226)',
                                        rotation: 0.5 + (1 - this.state.result.vpnValue / 100) / 2
                                    })}
                                />

                            </div>
                            <p>Percentage</p>
                            {this.state.feedbackData.isResultFetched && <Typography variant="h5" style={{ color: `${this.state.result.ipTypeColor}` }}>{this.state.result.ipType}</Typography>}
                        </div>
                    </Grid>
                    {/* ============= Host Details =========================== */}
                    <Grid item xs={12} md={6}>
                        <Paper variant="outlined" className="p-2">
                            <Typography className="text-center" variant="h5">Host details</Typography>
                            <Typography variant="h6" className="blinking" >{this.state.nmapData.status}</Typography>
                            {
                                this.state.ipDetails.proxy !== undefined && (
                                    <React.Fragment>
                                        <Typography variant="subtitle1">Proxy: {"" + this.state.ipDetails.proxy}</Typography>
                                        <Typography variant="subtitle1">VPN: {"" + this.state.ipDetails.vpn}</Typography>
                                    </React.Fragment>
                                )
                            }
                        </Paper>
                        <Button size="large" className="mt-3" variant="contained" startIcon={<PrintIcon />} onClick={this.printDiv.bind(this, 'printarea')}>Print Report</Button>

                    </Grid>
                    {/* ===================== Feddback for different Modules ====================== */}
                    <Grid item xs={12}>
                        <Paper variant="outlined" className="p-3">
                            <p className="text-center"><Typography variant="h5">Detection Modules</Typography></p>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6} >
                                    <p><Typography variant="subtitle1">{this.state.feedbackData.showCheckIpSpinner && <CircularProgress size="1rem" />}&nbsp; IP Check: &nbsp; <Chip size="small" color={this.state.feedbackData.checkIpValue == '1' ? "secondary" : "success"} clickable label={this.state.feedbackData.checkIpValue} /> </Typography></p>
                                    <p><Typography variant="subtitle1">{this.state.feedbackData.showCheckCidrSpinner && <CircularProgress size="1rem" />}&nbsp; CIDR Check: &nbsp; <Chip size="small" color={this.state.feedbackData.checkCidrValue == '1' ? "secondary" : "success"} clickable label={this.state.feedbackData.checkCidrValue} /> </Typography></p>
                                    <p><Typography variant="subtitle1">{this.state.feedbackData.showCheckThirdPartyDatasetSpinner && <CircularProgress size="1rem" />}&nbsp; Online Dataset Check: &nbsp; <Chip size="small" color={this.state.feedbackData.checkThirdPartyDatasetValue == '1' ? "secondary" : "success"} clickable label={this.state.feedbackData.checkThirdPartyDatasetValue} /> </Typography></p>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <p><Typography variant="subtitle1">{this.state.feedbackData.showMLModel1Spinner && <CircularProgress size="1rem" />}&nbsp; IP ML Model: &nbsp; <Chip size="small" color={this.state.feedbackData.checkMLModel1Value == '1' ? "secondary" : "success"} clickable label={this.state.feedbackData.checkMLModel1Value} /> </Typography></p>
                                    <p><Typography variant="subtitle1">{this.state.feedbackData.showMLModel2Spinner && <CircularProgress size="1rem" />}&nbsp; NMap ML model: &nbsp; <Chip size="small" color={this.state.feedbackData.checkMLModel2Value == '1' ? "secondary" : "success"} clickable label={this.state.feedbackData.checkMLModel2Value} /> </Typography></p>

                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    {/* ==========  IP Details ============================ */}
                    <Grid item xs={12} md={6} >

                        {/*<Paper className="p-1">
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
                        </Paper> */}
                        <Paper variant="outlined" className="p-2">
                            <Typography className="text-center" variant="h5">IP Detials</Typography>
                            <table className="vpntable text-break">
                                {
                                    Object.keys(this.state.ipDetails).map(key => (
                                        <React.Fragment>
                                            <tr>
                                                <th>{this.toSentenceCase(key)}</th>
                                                <td>{"" + this.state.ipDetails[key]}</td>
                                            </tr>
                                        </React.Fragment>
                                    ))
                                }
                            </table>
                        </Paper>

                    </Grid>
                    {/* =================== NMAP Details ================================== */}
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
                    <Grid item xs={12}>
                        <div id="map-container-google-1" class="z-depth-1-half map-container h-100" >
                            <iframe title="Maps" width="100%" height="100%" style={{ minHeight: "500px" }} src={`https://maps.google.com/maps?q=${this.state.mapCity}&t=&z=13&ie=UTF8&iwloc=&output=embed`} frameborder="0"
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

