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
        })
    },
    fetchOnlineDatasetsCronJob: function () {
        fs.writeFileSync(listOfIps, '');
        try {
            fs.unlinkSync('./MLServerCode/scripts/maxmind-geolite2-asn')
            fs.unlinkSync('./MLServerCode/scripts/maxmind-geolite2-country')
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