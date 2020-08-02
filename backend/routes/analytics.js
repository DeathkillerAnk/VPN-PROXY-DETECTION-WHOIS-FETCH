const router = require('express').Router();
const fs = require('fs');
const { route } = require('./whois');
const analyticsFile = "./MLServerCode/analytics.txt";
const mlModelLogsFile = "./MLServerCode/logs/mlModelLogs.txt";
const generateDataLogsFile = "./MLServerCode/logs/generateDataLogs.txt";

router.get('/getallanalytics', async (req, res) => {
    try {
        let analyticsData = fs.readFileSync(analyticsFile, 'utf-8');
        let mlLogs = fs.readFileSync(mlModelLogsFile, 'utf-8');
        let generateDataLogs = fs.readFileSync(generateDataLogsFile, 'utf-8');
        analyticsData = analyticsData.split(' ');
        const result = {
            totalData: analyticsData[0],
            trainData: analyticsData[1],
            testData: analyticsData[2],
            generateDataLogs: generateDataLogs,
            mlLogs: mlLogs
        };
        res.json(result);

    } catch (error) {
        res.status(500).json({ msg: "Could not read analytics", err: error.message });
    }

});
module.exports = router;