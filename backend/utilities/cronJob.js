const { exec, execFile } = require('child_process');
const fs = require('fs');
const listOfIps = './MLServerCode/scripts/ips.txt'
module.exports = {
    genWhoisAndTrainModelCronJob: function () {
        const genDataAndTrainModel = exec(`node generateData.js vpn < ips.txt`, { cwd: "./MLServerCode/scripts/" }, function (err, stdout, stderr) {
            if (stdout) {
                console.log(stdout);
            }
            console.log("Generate whois and train model Cron Job Finished");
            fs.writeFileSync('./MLServerCode/scripts/ips.txt', ''); //clear the file
        })
    },
    fetchOnlineDatasetsCronJob: function () {
        fs.writeFileSync(listOfIps, '');
        try {

            fs.unlinkSync('./MLServerCode/scripts/maxmind-geolite2-asn')
        } catch (error) {

        }
        const fetchOnlineDatasets = exec(`sh script.sh`, { cwd: "./MLServerCode/scripts/", terminal: true }, function (err, stdout, stderr) {
            if (stdout) {
                console.log(stdout);
            }
            console.log("Fetch online dataset Cron Job Finished");
        })
    }
}