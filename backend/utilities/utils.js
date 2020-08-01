module.exports = {
    /**
     * 
     * @param {String} url 
     */
    extractHostname: function (url) {

        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];
        //remove the subdomains
        let hostnameArr = hostname.split(".");
        if (hostnameArr.length > 2)
            hostname = hostnameArr[hostnameArr.length - 2] + "." + hostnameArr[hostnameArr.length - 1];
        return hostname;
    },
    isValidIPaddress: function (ipaddress) {
        //Normal reged
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return true;
        }
        //regex with subnet
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/\d{1,2})?$/.test(ipaddress)) {
            return true;
        }
        return false
    }
}