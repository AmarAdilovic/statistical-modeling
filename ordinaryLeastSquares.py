import pandas as pd
import numpy as np
import statsmodels.api as sm
import matplotlib.pyplot as plt  # To visualize
import sys
import io
import base64
import json
import os

# Reads in the first argument passed in, either the "default" value, or any user uploaded files
file = sys.argv[1]
# The default value results in a randomly generated dataFrame of 25 values, 
# with the default column names of 'x' and 'y'
if(file == "default"):
      dataFrame = pd.DataFrame(columns=['x','y'])
      for i in range(25):
            randIntArray = np.random.randint(25, size=25)
            dataFrame.loc[i] = [randIntArray[np.random.randint(25)], randIntArray[np.random.randint(25)]]
      headerList = ['x', 'y']
      cwd = os.getcwd()
      path = cwd + "/csvFiles/"
      dataFrame.to_csv(path + "generated.csv")
else:
      # Reads in the csv file passed in
      dataFrame = pd.read_csv(file)
      # List of the header values at the top of each column
      headerList = pd.read_csv(file, nrows=0).columns.tolist()


x = dataFrame[headerList[0]] # predictor
y = dataFrame[headerList[1]] # response
x = sm.add_constant(x)  # Adds a constant term to the predictor

fig = plt.figure(figsize=(12,8))
est=sm.OLS(y, x)
est = est.fit()

# Currently results in an error due to a print statement within regressionplots.py in the statsmodels package
# Opened issue request #8248 on statsmodels, however if using a stable release of statsmodels (0.13.X), will result in issues
# Need to use older version of statsmodels (0.12.2) and an older version of scipy (1.7.0)
# or a newer unreleased one (at this time) (>=.0.14.X)
fig = sm.graphics.plot_regress_exog(est, headerList[0], fig=fig)

# Encode the plot image into base64 and pass it to the server
buffer = io.BytesIO()
plt.savefig(buffer, format='jpg')
buffer.seek(0)
base64ImageData = base64.b64encode(buffer.read())
print(json.dumps({'img': base64ImageData.decode('utf-8')}))