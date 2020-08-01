#!/usr/bin/env python

import sys
import json
import joblib
from sklearn.preprocessing import OneHotEncoder
from sklearn.svm import OneClassSVM
import numpy as np

model_file_name = "./models/trained_model.sav"
encoder_file_name = "./models/one_hot_encoder.sav"

whois_json = sys.stdin.read()
whois_json = json.loads(whois_json)
clf: OneClassSVM = joblib.load(model_file_name)
one_hot_encoder:OneHotEncoder  = joblib.load(encoder_file_name)

test_data = np.array([[ whois_json['orgName'] ]])
try:
    X = one_hot_encoder.transform(test_data).toarray()
    prediction = clf.predict(X)
    print(prediction[0])
    
except:
    print(-1)
    