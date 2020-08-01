const router = require('express').Router();
const whoisjson = require('whois-json')
const dns = require('dns');
const utils = require('../utilities/utils')
// const path = require('path')


    /**whois fetch
     * 
     * @param {String} host 
     */

router.route('/getrecord').post(async(req, res) => {
    try {
        let host = req.body && typeof req.body.host === 'string' ? req.body.host : "";
        if (!host)
            return res.status(400).json({ msg: "Please provide a host name of ip addresss" });

        if (!utils.isValidIPaddress(host)) {
            host = utils.extractHostname(host);
            // res.json(host)
            // console.log(host);
        }
        const result = await whoisjson(host);

        //response is here
        dns.lookup(host, (err, address, IPfamily) => {
            if(!err){
                result.hostingIPAddr = address;
                result.hostingIPFamily =  IPfamily;
                // console.log(result)
                res.json(result);
            }
        })
        // console.log(result)
        // res.json(result);

    } catch (error) {
        res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });
    }
    
  });

module.exports = router;