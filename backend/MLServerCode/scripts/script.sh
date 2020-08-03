#!/usr/bin/bash
wget https://tinyurl.com/maxmind-geolite2-asn
rm -r GeoLite2-ASN-CSV_20200728
unzip  ./maxmind-geolite2-asn 
cat ./GeoLite2-ASN-CSV_20200728/GeoLite2-ASN-Blocks-IPv4.csv | cut -d ',' -f1 >> ips.txt
rm -r ./GeoLite2-Country-CSV_20200728
wget https://tinyurl.com/maxmind-geolite2-country
unzip maxmind-geolite2-country
cat ./GeoLite2-Country-CSV_20200728/GeoLite2-Country-Blocks-IPv4.csv | cut -d ',' -f1 >> ips.txt

