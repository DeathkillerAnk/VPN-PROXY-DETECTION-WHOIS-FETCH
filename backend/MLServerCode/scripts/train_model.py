#!/usr/bin/env python
# coding: utf-8

# NOTE: The current working directry in ../MLServerCode for this script and not ./

# ======================= Import =======================
import pandas as pd
import glob
import os
import pprint
from ipaddress import IPv4Address, IPv4Network
import ipaddress
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.svm import OneClassSVM
import joblib
from datetime import datetime

print("[", datetime.now(), "]", "Started Training Model")

# =================== CONSTANTS ============================================
model_file_name = "./models/trained_model.sav"
encoder_file_name = "./models/one_hot_encoder.sav"


# ==================== Loading data =========================

# **Note**
# - Create a `data` inside the folder where this notebook is present
# - Place all the `.csv` files inside the `data` folder
print("[", datetime.now(),"]", "Loading CSV Files")
frames = [ pd.read_csv(f) for f in glob.glob('./data/*.csv') ]
df = pd.concat(frames, ignore_index=True, sort=False)
totalSize = df.shape[0]

# ========================= Data preprocessing ====================

# ## Dropping all NaN values

# Filetering Data
df = df[['inputIp','orgName','netRange', 'cidr','yResultLabel']]
df.dropna(axis=0,how = 'any', inplace=True)

#Removing trailing spaces
df['orgName'] = df['orgName'].str.strip()
df['cidr'] = df['cidr'].str.split(' ')
df['cidr'] = df['cidr'].apply(lambda x: x[0])
df['cidr'] = df['cidr'].str.strip(',')


# Creating dataset

X = df.iloc[:,[1]].values
Y = df.iloc[:, -1].values
Y = Y.reshape(Y.shape[0], 1)
# Encoding categorical data
one_hot_encoder = OneHotEncoder()
X = one_hot_encoder.fit_transform(X).toarray()
print("[", datetime.now(),"]", "Dataset created")

# Train and Test set
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=0)


# ================================ MODEL ================================
print("[", datetime.now(),"]", "Training Model")
clf = OneClassSVM(gamma='auto').fit(X_train)
# clf.predict(X_test)
print("[", datetime.now(),"]", "Model trained")


# ===================== Saving Model =======================================
print("[", datetime.now(),"]", "Saving Model")
joblib.dump(clf, model_file_name);
joblib.dump(one_hot_encoder, encoder_file_name)
analyticsFileName = "analytics.txt"
f = open(analyticsFileName, "w+")
f.write(str(totalSize) + " " + str(X_train.shape[0]) + " " + str(X_test.shape[0]) )
f.close()

