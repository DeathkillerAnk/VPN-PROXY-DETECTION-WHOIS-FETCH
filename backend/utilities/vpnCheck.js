const { report } = require('../routes/whois');

module.exports = {
    /**
     * 
     * @param {String} ip 
     */
    vpnScan: function(ip){
        
        const nmap = require('libnmap');
        const opts = {
        json: true,
        range: [ip],
        ports: '1723,1701,500,4500,1194,443'
        // verbose: true,
        // ports: '1-65535',
        };

        nmap.scan(opts, function(err, report) {
        if (err) throw new Error(err);

        for (let item in report) {
            // console.log(JSON.stringify(report[item].host, null, 2));
            console.log(type(report))
            // return report[item].host
        }
        // console.log(JSON.stringify(report[0].host, null, 2));
        });
        // return report[0].host

// const isopen = require("isopen");
 
// // Check single port
// isopen('github.com', 80,function(response){
//     console.log(response);
// });
 
// // Check Range 
// isopen('github.com', '20-30',function(response){
//     console.log(response);
// });
 
// Check array of ports 
// isopen('219.100.37.149', [1723,1701,500,4500,1194,443],function(response){
//     console.log(response);
// });
    }
}