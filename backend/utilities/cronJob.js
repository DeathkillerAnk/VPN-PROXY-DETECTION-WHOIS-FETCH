const { exec } = require('child_process');

module.exports = function cronJob() {
    const genDataAndTrainModel = exec(`node generateData.js vpn < ips.txt`, { cwd: "./MLServerCode/scripts/" }, function (err, stdout, stderr) {
        if (stdout) {
            console.log(stdout);
        }
        console.log("Cron Job Finished");
    })
}