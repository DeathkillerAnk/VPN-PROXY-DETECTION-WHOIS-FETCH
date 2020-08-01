const express = require('express');
const cors = require('cors');
// require('dotenv').config();
// const path = require('path')


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const whois = require('./routes/whois');
const vpndetect = require('./routes/vpndetect');


app.use('/api/whois', whois);
app.use('/api/vpndetect', vpndetect);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});