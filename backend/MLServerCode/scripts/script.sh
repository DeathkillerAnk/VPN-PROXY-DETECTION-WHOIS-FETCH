#!/usr/bin/bash
wget https://tinyurl.com/maxmind-geolite2-asn
rm -r GeoLite2-ASN-CSV_20200728
unzip  ./maxmind-geolite2-asn 
cat ./GeoLite2-ASN-CSV_20200728/GeoLite2-ASN-Blocks-IPv4.csv | cut -d ',' -f1 >> ips.txt

