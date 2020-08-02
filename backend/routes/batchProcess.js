const vpnCheck = require('../utilities/vpnCheck')
const router = require('express').Router();
const whoisJson = require('whois-json');
const fetchWhois = require('../utilities/utils').fetchWhois;
const { spawn, exec, execFile } = require('child_process');

router.post('/processfile', async (req, res) => {
    try {
        let ipFile = req.files.ipFile;
        let ips = ipFile.data.toString('utf8').split('\n');
        ips.pop();
        queries = [];
        ips.forEach(ip => {
            queries.push(fetchWhois(ip))
        });
        const whoisRecordsTemp = await Promise.all(queries);
        let whoisRecords = [];
        let validIps = []
        whoisRecordsTemp.forEach((record, index) => {
            if (record && !record.error) {
                whoisRecords.push({ inputIp: ips[index], ...record });
                validIps.push(ips[index]);
            }
        });
        delete whoisRecordsTemp; //Clear the memory
        delete ips; //Clear the memory
        const pythonExec = exec(`python ./scripts/checkIpBatch.py "${validIps.join(' ')}"`, { cwd: "./MLServerCode/" }, function (err, stdout, stderr) {
            if (stdout) {
                dataToSend = stdout;
                dataToSend = dataToSend.split(' ');
                dataToSend.pop();
                console.log(dataToSend.length + " " + whoisRecords.length);
                dataToSend.forEach((data, index) => {
                    whoisRecords[index] = { inputIp: whoisRecords[index].inputIp, isBad: data, ...whoisRecords[index] }
                });
                res.status(200).send(whoisRecords);
                return;
            }
            else if (err) {
                res.status(500).json({ msg: "Some error occured. Please try again later", err: err.message });
                return;
            }
            else {
                res.status(500).json({ msg: "Some error occured. Please try again later", err: "" });

            }
        })
    } catch (error) {
        res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });
    }
});

router.post('/file', async (req, res) => res.send("hell"));

module.exports = router;
