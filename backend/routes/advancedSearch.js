const router = require('express').Router();
const nmap = require('libnmap');

    /**nmapsearch
     * 
     * @param {String} host 
     */

    router.route('/nmap').post(async(req, res) => {
        try {
            let host = req.body && typeof req.body.host === 'string' ? req.body.host : "";
            if (!host)
                return res.status(400).json({ msg: "Please provide a host name of ip addresss" });
    
            if (!utils.isValidIPaddress(host)) {
                host = utils.extractHostname(host);
                // res.json(host)
                // console.log(host);
            }
            

    
        } catch (error) {
            res.status(500).json({ msg: "Some error occured. Please try again later", err: error.message });
        }
        
      });
    
module.exports = router;


const opts = {
    flags: [
      '-sV', // Open port to determine service (i.e. FTP, SSH etc)
      '-O', // OS finger printing (requires elevated privileges)
      '-sC', // Enables the nmap scripts (all) against each host (requires elevated privileges)
      '--traceroute', // Turns on tracerouting
      '--script traceroute-geolocation' // Turns on GeoIP functionality per hops
    ],
    range: ['scanme.nmap.org', '36.91.188.18']
  };

  nmap.scan(opts, function(err, report) {
    if (err) throw err;
  
    for (let item in report) {
      console.log(JSON.stringify(report[item], null, 2));
    }
  });