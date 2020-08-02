const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
// require('dotenv').config();
// const path = require('path')


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());


const whois = require('./routes/whois');
const vpndetect = require('./routes/vpndetect');
const batchProcess = require('./routes/batchProcess');


app.use('/api/whois', whois);
app.use('/api/vpndetect', vpndetect);
app.use('/api/batchprocess', batchProcess);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});