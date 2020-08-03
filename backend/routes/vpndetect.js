const vpnCheck = require('../utilities/vpnCheck')
const {MLModel2Check, MLModel1Check} = require('../utilities/utils')
const router = require('express').Router();
// const path = require('path')
const nmap = require('libnmap');
const { spawn, exec, execFile } = require('child_process');
const { response } = require('express');
const axios = require('axios'); //added const
var ip2proxy = require("ip2proxy-nodejs");
const whoisjson = require('whois-json');
const { route } = require('./whois');
const fs = require('fs');

const checkIp = './MLServerCode/scripts/checkIp.py'
const predict = './MLServerCode/scripts/predict.py'
const listOfIps = './MLServerCode/scripts/ips.txt'
const vpnIps = './MLServerCode/scripts/IPv4_VPNs.txt'



    /**vpn port scan
     * 
     * @param {String} url 
     */

router.route('/vpnports').post(async (req, res) => {
    try {
        let host = req.body && typeof req.body.host === 'string' ? req.body.host : "";
        if (!host) {
            return res.status(400).json({ msg: "Please provide a host name of ip addresss" });
        }
        //scanning options
        const opts = {
            json: true,
            range: [host],
            ports: '1723,1701,500,4500,1194,443',
            verbose: true,
            // ports: '1-65535',
        };

        // const scanResult =  vpnCheck.vpnScan(host);
        //scanning

        nmap.scan(opts, function (err, report) {

            //handle later
            try {
                if (err) {
                    res.status(500).json({ msg: "Some error occured", err: err.message })
                }
    
                
    
                for (let item in report) {
                    if(report[item].runstats[0].hosts[0].item.up == "1"){
                        // console.log(JSON.stringify(report[item].runstats[0].hosts[0].item.up, null, 2), "sent stats");
                        // console.log(JSON.stringify(report[item], null, 2), "print");
    
                        // console.log("sent");
    
                        /**
                         * hostname is array of hostnames with item object, name & type as child key
                         * "hostname": [
                                {
                                "item": {
                                    "name": "oushu.schotomacs.com",
                                    "type": "PTR"
                                }
                                }
                            ]
                         * 
                         * 
                         * 
                         * 
                         */
                        res.json({
                                ports:report[item].host[0].ports[0].port,
                                hostname:report[item].host[0].hostnames[0].hostname,
                                status: "Host is Up"
                            });
                    }
                    else{
                        res.json({ status: "Host is down", msg: "Host is down", ports:[] });
                    }
                    // console.log(JSON.stringify(report[item].runstats[0].hosts[0].item.up, null, 2), "out");
                    // console.log(report[item].host.status[0].item.state)
    
                    // if host is down
                    // if (report[item].host.status[0].item.state !== "down" || report[item]) {
                    //     console.log(report[item],"down");
                    //     res.json({ status: "Down" });
                    // }else{
                    //     //response is here
                    //     console.log("sent");
                    //     res.json({response:report[item].host.ports[0].port});
                        
                    // }
                    
                }
            } catch (error) {
                res.status(500).json({ msg: "Host is down", err: error.message });
            }
            
        });


    } catch (error) {
        res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });
    }

});


/**ML running for ip cidr
 * 
 * @param {String} hostipaddr 
 */
router.route('/checkcidr').post(async (req, res) => {
    try {
        let host = req.body && typeof req.body.host === 'string' ? req.body.host : "";
        if (!host) {
            return res.status(400).json({ msg: "Please provide a host name of ip addresss" });
        }


        var dataToSend;
        // spawn new child process to call the python script
        const pythonExec = exec(`python ./scripts/checkIp.py ${host}`, { cwd: "./MLServerCode/" }, function (err, stdout, stderr) {
            if (stdout) {
                dataToSend = stdout;
                dataToSend = dataToSend == 'true' ? 1 : 0;
                res.json({ result: dataToSend });
                return;
            }
            else if (err) {
                res.status(500).json({ msg: "Some error occured. Please try again later", err: err.message });
                return;
            }
            else {
                res.status(500).json({ msg: "Some error occured. Please try again later", err: "" });

            }
        });
        // collect data from script
        // python.stdout.on('data', function (data) {
        //     console.log('Pipe data from python script ...');
        //     dataToSend = data.toString();
        // });
        // // in close event we are sure that stream from child process is closed
        // python.on('close', (code) => {
        //     console.log(`child process close all stdio with code ${code}`);
        //     // send data to browser
        //     res.json({ checkIp: dataToSend })
        // });



    } catch (error) {
        res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });
    }

});

/**  gives ip type & fraud score
*
* @param {string} host
*/
router.route('/qualityscore').post(async (req, res) => {
    try {
        let host = req.body && typeof req.body.host === 'string' ? req.body.host : "";
        if (!host) {
            return res.status(400).json({ msg: "Please provide a host name of ip addresss" });
        }
        
        // let key = mcfLlGm2jceQIvqZpc4hmKzkLuuUHtK8;
        
        MLModel2Check(host).then(response=>{
                // console.log(response.data);
                res.json({ result: response.data });
            })
            .catch(error=>{res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });})

    } catch (error) {
        res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });
    }

});

/**  ML intel score
*
* @param {string} host
*/
router.route('/intelscore').post(async (req, res) => {
    try {
        let host = req.body && typeof req.body.host === 'string' ? req.body.host : "";
        if (!host) {
            return res.status(400).json({ msg: "Please provide a host name of ip addresss" });
        }
        
        
        MLModel1Check(host).then(response => {
                // console.log(response.data);
                res.json({ result: response.data });
                if(response.data > 0.5){
                    fs.appendFileSync(listOfIps, host + '\n');
                }
            })
            .catch(error=>{res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });})

    } catch (error) {
        res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });
    }

});

//local search

ip2proxy.Open("../data/large.BIN");
/**  local search
*
* @param {string} host
*/
router.route('/ipsearch').post(async (req, res) => {
    try {
        let host = req.body && typeof req.body.host === 'string' ? req.body.host : "";
        if (!host) {
            return res.status(400).json({ msg: "Please provide a host name of ip addresss" });
        }
        
        isProxy = ip2proxy.isProxy(host)
        // let key = mcfLlGm2jceQIvqZpc4hmKzkLuuUHtK8;
        console.log("isProxy: " + ip2proxy.isProxy(host));
        console.log("GetModuleVersion: " + ip2proxy.getModuleVersion());
        console.log("GetPackageVersion: " + ip2proxy.getPackageVersion());
        console.log("GetDatabaseVersion: " + ip2proxy.getDatabaseVersion());
        res.json({result:isProxy});

    } catch (error) {
        res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });
    }

});

/**check(ml) running for organisation
 * 
 * @param {String} hostipaddr 
 */
router.route('/checkorg').post(async (req, res) => {
    try {
        let host = req.body && typeof req.body.host === 'string' ? req.body.host : "";
        if (!host) {
            return res.status(400).json({ msg: "Please provide a host name of ip addresss" });
        }
        // if (!utils.isValidIPaddress(host)) {
        //     host = utils.extractHostname(host);
        //     // res.json(host)
        //     console.log(host);
        // }
        const result = await whoisjson(host);
        const stringResult = `{"orgName":"${result.orgName}"}`

        // res.json(stringResult);

        var dataToSend;
        // spawn new child process to call the python script
        const pythonExec = exec(`python ./scripts/checkOrg.py << ${stringResult}`, { cwd: "./MLServerCode/" }, function (err, stdout, stderr) {
            if (stdout) {
                dataToSend = stdout;
                dataToSend = dataToSend == 'true' ? 1 : 0;
                res.json({ result: dataToSend });
                return;
            }
            else if (err) {
                res.status(500).json({ msg: "Some error occured. Please try again later", err: err.message });
                return;
            }
            else {
                res.status(500).json({ msg: "Some error occured. Please try again later", err: "" });

            }
        });
        // collect data from script
        // python.stdout.on('data', function (data) {
        //     console.log('Pipe data from python script ...');
        //     dataToSend = data.toString();
        // });
        // // in close event we are sure that stream from child process is closed
        // python.on('close', (code) => {
        //     console.log(`child process close all stdio with code ${code}`);
        //     // send data to browser
        //     res.json({ checkIp: dataToSend })
        // });



    } catch (error) {
        res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });
    }

});
router.post('/checkip', (req, res) => {
    try {
        let host = req.body && typeof req.body.host === 'string' ? req.body.host : "";
        if (!host) {
            return res.status(400).json({ msg: "Please provide a host name of ip addresss" });
        }
        const data = fs.readFileSync(vpnIps, 'utf-8');
        result = data.indexOf(host) > -1 ? 1 : 0;
        res.json({ result: result });

    } catch (error) {
        res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });

    }
});
router.post('/checkonlinedata', (req, res) => {
    let host = req.body && typeof req.body.host === 'string' ? req.body.host : "";
    if (!host) {
        return res.status(400).json({ msg: "Please provide a host name of ip addresss" });
    }
    const data = fs.readFileSync(listOfIps, 'utf-8');
    result = data.indexOf(host) > -1 ? 1:0;
    res.json({result:result});
});


router.route('/getrealip').post(function (req, res) {
    // need access to IP address here
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress
    console.log(ip,req.headers);
})

module.exports = router;
