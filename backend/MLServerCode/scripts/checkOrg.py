#!/usr/bin/env python

import pandas as pd
import glob
import os
import pprint
from ipaddress import IPv4Address, IPv4Network
import ipaddress
import numpy as np
import sys

pd.set_option('display.max_columns', 111)
pp = pprint.PrettyPrinter(indent=4)


# # Load data

# **Note**
# - Create a `data` inside the folder where this notebook is present
# - Place all the `.csv` files inside the `data` folder

frames = [ pd.read_csv(f) for f in glob.glob('./data/*.csv') ]
df = pd.concat(frames, ignore_index=True, sort=False)

df = pd.concat(frames, ignore_index=True, sort=False) # Re writing so that this cell can be run again n again
# Filetering Data
df = df[['inputIp','orgName','netRange', 'cidr','yResultLabel']]
df.dropna(axis=0,how = 'any', inplace=True)

#Removing trailing spaces
df['orgName'] = df['orgName'].str.strip()
df['cidr'] = df['cidr'].str.split(' ')
df['cidr'] = df['cidr'].apply(lambda x: x[0])
df['cidr'] = df['cidr'].str.strip(',')


# ## Search Methods

def checkIfIpExistInCidr(ip)->bool:
    ip = IPv4Address(ip)
    series = df['cidr'].apply(lambda x: True if ip in IPv4Network(x) else False)
    return series.agg(np.any)
    
def checkOrg(org):
    return (df['orgName'] == org).any()

if __name__ == "__main__":
    org = sys.argv[1]
    print(str(checkOrg(org)).lower())
