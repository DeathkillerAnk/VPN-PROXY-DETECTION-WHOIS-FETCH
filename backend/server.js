const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const schedule = require('node-schedule');
const { genWhoisAndTrainModelCronJob, fetchOnlineDatasetsCronJob } = require('./utilities/cronJob')
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
const analytics = require('./routes/analytics');
const advancedSearch = require('./routes/advancedSearch');


app.use('/api/whois', whois);
app.use('/api/vpndetect', vpndetect);
app.use('/api/batchprocess', batchProcess);
app.use('/api/analytics', analytics);
app.use('/api/advancedsearch', advancedSearch);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

var cron1 = schedule.scheduleJob('10 * * * *', function () {
    console.log("Fetch online dataset cron running");
    fetchOnlineDatasetsCronJob();
});
var cron2 = schedule.scheduleJob('30 * * * *', function () {
    console.log("Generate whois and train model cron running");
    genWhoisAndTrainModelCronJob();
});