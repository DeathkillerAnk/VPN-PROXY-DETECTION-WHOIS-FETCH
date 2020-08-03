/**
 * Used to generate the output from the list of input ips
 * **Usage**
 * node generateData.js ylabel [outputFile] < inputFile.txt [ > outputFile.txt ]
 * @example
 * `node generateData.js vpn < vpnInput.txt > vpnWhois.txt`
 * `node generateData.js vpn < vpnInput.txt > vpnWhois.txt`
 */

const readline = require('readline');
const fs = require('fs');
const whoisjson = require('whois-json')
const utils = require('../../utilities/utils');
var jsonToCSV = require('json-to-csv');
var { exec } = require('child_process')

let ylabel = process.argv[2]
let ipsArray = [];
let resultsArray = [];

let noOfReattempts = 40; // Change here to change the no. of reattempts 

//Logs related
let printLogs = true;
let nProcessed = 0;
let nTotal = 0;
let nFetced = 0;

var logFileName = "../logs/generateDataLogs.txt";
var csvFile = `../data/${Date.now()}.csv`
var analyticsFile = `../analytics.txt`;

var rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
//empty the log file
printLogs && fs.writeFileSync(logFileName, "");
fs.writeFileSync("failedIps.txt", "");

rl.on('line', function (host) {
    ++nTotal;
    if (utils.isValidIPaddress(host)) {
        if(ipsArray.length<5001)
            ipsArray.push(host);
        ++nProcessed;
    } else {
        // printLogs && fs.appendFileSync(logFileName, "Host " + host + " not processed\n");
    }
});
rl.on('close', () => {
    printLogs && fs.appendFileSync(logFileName, nProcessed + " total no of IPs processed\n");
    attemptProcessIPs(ipsArray);
});


async function attemptProcessIPs(ipsArray) {
    let queries = [];
    let inputIpList = [];

    // Make list of promises
    ipsArray.forEach(ip => {
        queries.push(fetchWhois(ip));
        inputIpList.push(ip);
    });

    // Use the following again for failed ips
    ipsArray = [];

    // Await for all the responses
    const allData = await Promise.all(queries);

    //Process all responses (Whois response_)
    allData.forEach((data, index) => {
        if (data && !data.error) {
            data = { inputIp: inputIpList[index], ...data, yResultLabel: ylabel }
            resultsArray.push(data);
            ++nFetced;
        }
        if (!data || data.error) {
            ipsArray.push(inputIpList[index]);
        }
    });

    if (noOfReattempts-- > 0 && ipsArray.length > 0) {
        fs.appendFileSync(logFileName, `
        ======== Reattempts Pending ==============
        nProcessed: ${nProcessed}
        nNotProcessed: ${nTotal - nProcessed}
        nFetched: ${nFetced}
        nFailed: ${nProcessed - nFetced}
        ========================================
        `)
        fs.appendFileSync(logFileName, "Re attempting " + (noOfReattempts + 1));
        attemptProcessIPs(ipsArray);
    }
    else {
        fs.appendFileSync(logFileName, `
        =============== END ====================
        nProcessed: ${nProcessed}
        nNotProcessed: ${nTotal - nProcessed}
        nFetched: ${nFetced}
        nFailed: ${nProcessed - nFetced}
        ========================================
        `);
        ipsArray.forEach(ips => fs.appendFile("failedIps.txt", ips + "\n", (err) => { }));
        //console.log(JSON.stringify(resultsArray, null, 4));
        await jsonToCSV(resultsArray, csvFile);
        const pythonExec = exec(`python ./scripts/train_model.py > ./logs/mlModelLogs.txt`, { cwd: "../" }, function (err, stdout, stderr) {
           
                console.log("model trained");
            
        });

    }
}


async function fetchWhois(host) {
    try {
        const result = await whoisjson(host);
        return result;
    } catch (error) {
        return false;
    }
}