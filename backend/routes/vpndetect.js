const vpnCheck = require('../utilities/vpnCheck')
const router = require('express').Router();
// const path = require('path')
const nmap = require('libnmap');
const { spawn, exec, execFile } = require('child_process');
const { response } = require('express');
axios = require('axios');

const checkIp = './MLServerCode/scripts/checkIp.py'
const predict = './MLServerCode/scripts/predict.py'

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
            ports: '1723,1701,500,4500,1194,443'
            // verbose: true,
            // ports: '1-65535',
        };

        // const scanResult =  vpnCheck.vpnScan(host);
        //scanning

        nmap.scan(opts, function (err, report) {
            //handle later
            if (err) {
                res.status(500).json({ msg: "Some error occured", err: err.message })
            }



            for (let item in report) {
                // console.log(JSON.stringify(report[item].host, null, 2));


                // if host is down
                if (report[item].host[0].status[0].item.state !== "up") {
                    res.json({ status: "Down" });
                }

                //response is here
                res.json(report[item].host[0].ports[0].port);
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
                res.json({ checkIp: dataToSend })
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
        let toCheck = 'https://ipqualityscore.com/api/json/ip/zUqnfFUGTHCSwQOF7TO3mb8oJHf5JF0E/'+host;
        
        axios.get(toCheck)
            .then(response=>{
                // console.log(response.data);
                res.json({qualityscore:response.data});
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
        
        // let key = mcfLlGm2jceQIvqZpc4hmKzkLuuUHtK8;
        let toCheck = 'http://check.getipintel.net/check.php?ip='+host+'&contact=aniket.g@gmail.com';
        
        axios.get(toCheck)
            .then(response=>{
                // console.log(response.data);
                res.json({intelscore:response.data});
            })
            .catch(error=>{res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });})

    } catch (error) {
        res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });
    }

});


module.exports = router;
