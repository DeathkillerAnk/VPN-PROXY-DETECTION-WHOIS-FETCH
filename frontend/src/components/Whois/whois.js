import React, { Component } from 'react';
import { TextField, IconButton, InputAdornment, Grid, Paper } from '@material-ui/core';
import { SearchRounded as SearchIcon } from "@material-ui/icons";
import { LoadingContext } from "../../Context/LoadingContext"
import './whois.css'
import axios from 'axios'

function NumberList1(props) {
  const data = props.data;

  const listItems = Object.entries(data).map(([key, value]) =>
    <li key={key}>
      {key}
    </li>
  )
  return (
    <ul>{listItems}</ul>
  );
}
function NumberList2(props) {
  const data = props.data;

  const listItems = Object.entries(data).map(([key, value]) =>
    <li key={key}>
      {value}
    </li>
  )
  return (
    <ul>{listItems}</ul>
  );
}

function visible() {
  var x = document.getElementById("searchbtn");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}


export default class Whois extends Component {
  static contextType = LoadingContext;
  constructor(props) {
    super(props)
    this.state = {
      whoissearch: '',
      whoisRecord: {},
    }
  }

  handleSubmit = async (event) => {
    this.context.showSpinner();
    try {
      const response = await axios.post('/api/whois/getrecord', { host: this.state.whoissearch }, { validateStatus: () => true });
      const { data, status } = response;
      this.context.hideSpinner();
      if (status !== 200) {
        this.context.showSnackBar(data.msg);
        return;
      }
      this.context.showSnackBar("Record fetched successfully")
      this.setState({ whoisRecord: data });
    }
    catch (err) {
      console.log({ ...err });
      this.context.hideSpinner();
      this.context.showSnackBar("Some error occured");
    }
  }
  handleInputChange = (event => {
    event.preventDefault()
    this.setState({
      [event.target.name]: event.target.value
    })
  })
  camel2title = (camelCase) => camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase());
  render() {
    const data = this.state.whoisRecord;
    // const data = {
    //   "domainName": "google.com",
    //   "registryDomainId": "2138514_DOMAIN_COM-VRSN",
    //   "registrarWhoisServer": "whois.markmonitor.com",
    //   "registrarUrl": "http://www.markmonitor.com",
    //   "updatedDate": "2015-06-12T10:38:52-0700",
    //   "creationDate": "1997-09-15T00:00:00-0700",
    //   "registrarRegistrationExpirationDate": "2020-09-13T21:00:00-0700",
    //   "registrar": "MarkMonitor, Inc.",
    //   "registrarIanaId": "292",
    //   "registrarAbuseContactEmail": "abusecomplaints@markmonitor.com",
    //   "registrarAbuseContactPhone": "+1.2083895740",
    //   "domainStatus": "clientUpdateProhibited (https://www.icann.org/epp#clientUpdateProhibited)",
    //   "registrantName": "Dns Admin",
    //   "registrantOrganization": "Google Inc.",
    //   "registrantStreet": "Please contact contact-admin@google.com, 1600 Amphitheatre Parkway",
    //   "registrantCity": "Mountain View",
    //   "registrantStateProvince": "CA",
    //   "registrantPostalCode": "94043",
    //   "registrantCountry": "US",
    //   "registrantPhone": "+1.6502530000",
    //   "registrantFax": "+1.6506188571",
    //   "registrantEmail": "dns-admin@google.com",
    //   "adminName": "DNS Admin",
    //   "adminOrganization": "Google Inc.",
    //   "adminStreet": "1600 Amphitheatre Parkway",
    //   "adminCity": "Mountain View",
    //   "adminStateProvince": "CA",
    //   "adminPostalCode": "94043",
    //   "adminCountry": "US",
    //   "adminPhone": "+1.6506234000",
    //   "adminFax": "+1.6506188571",
    //   "adminEmail": "dns-admin@google.com",
    //   "techName": "DNS Admin",
    //   "techOrganization": "Google Inc.",
    //   "techStreet": "2400 E. Bayshore Pkwy",
    //   "techCity": "Mountain View",
    //   "techStateProvince": "CA",
    //   "techPostalCode": "94043",
    //   "techCountry": "US",
    //   "techPhone": "+1.6503300100",
    //   "techFax": "+1.6506181499",
    //   "techEmail": "dns-admin@google.com",
    //   "nameServer": "ns4.google.com ns2.google.com ns1.google.com ns3.google.com",
    //   "dnssec": "unsigned",
    //   "urlOfTheIcannWhoisDataProblemReportingSystem": "http://wdprs.internic.net/",
    //   "lastUpdateOfWhoisDatabase": "2017-02-22T03:53:14-0800 <<<"
    // }
    const { whoissearch } = this.state



    return (

      <React.Fragment>
        <Grid container >
          <Grid item xs={12}>
            <div className="py-3 text-center">
              <TextField
                name="whoissearch"
                variant="outlined"
                className="w-90"
                style={{ backgroundColor: "white" }}
                label="Enter IP or Host"
                value={whoissearch}
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
            <p className="dd text-center">Domain Details</p>
            <div className="card3 p-3">
              {/* <p className="whocolumn1"><NumberList1 data={data} />
              </p>
              <p className="whocolumn2"><NumberList2 data={data} /></p> */}
              <table className="whois-table text-break">
                {
                  Object.keys(data).map(key => (
                    <React.Fragment>
                      <tr>
                        <th>{this.camel2title(key)}</th>
                        <td>{data[key]}</td>
                      </tr>
                    </React.Fragment>
                  ))
                }
              </table>
            </div>

          </Grid>
        </Grid>

      </React.Fragment >
    );
  }
}















