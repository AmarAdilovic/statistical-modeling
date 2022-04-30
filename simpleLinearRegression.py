from matplotlib import use
import numpy as np
import matplotlib.pyplot as plt  # To visualize
import pandas as pd
from sklearn.linear_model import LinearRegression
from scipy import stats
from scipy.stats import t
import io
import base64
import json
import sys
import os

# Reads in the first argument passed in, either the "default" value, or any user uploaded files
file = sys.argv[1]
# The default value results in a randomly generated dataFrame of 50 values, 
# with the default column names of 'x' and 'y'
if(file == "default"):
      dataFrame = pd.DataFrame(columns=['x','y'])
      for i in range(50):
            randIntArray = np.random.randint(50, size=50)
            dataFrame.loc[i] = [randIntArray[np.random.randint(50)], randIntArray[np.random.randint(50)]]
      headerList = ['x', 'y']
      cwd = os.getcwd()
      path = cwd + "/csvFiles/"
      file = path + "generated.csv"
      dataFrame.to_csv(file)
else:
      # Reads in the csv file passed in
      dataFrame = pd.read_csv(file)
      # List of the header values at the top of each column
      headerList = pd.read_csv(file, nrows=0).columns.tolist()

# Reshapes the data as the data should have a single feature
x = (dataFrame[headerList[0]]).values.reshape(-1,1)
y = (dataFrame[headerList[1]]).values.reshape(-1,1)

# Create object for the LinearRegression class
linear_regressor = LinearRegression()  
# Performs the linear regression
linear_regressor.fit(x, y)
# Makes predictions
Y_pred = linear_regressor.predict(x)  

result = stats.linregress(x[:,0], y[:,0])

# Used to ensure any numbers are rounded to the 4th decimal place
fourNumFloat = "%.4f"

yHatEquation = "ŷ= " + fourNumFloat % result.intercept + " + " + fourNumFloat % result.slope + "x"
RSquared = (result.rvalue)*(result.rvalue)

tinv = lambda p, degreesOfFreedom: abs(t.ppf(p/2, degreesOfFreedom))
criticalValue = tinv(0.05, len(x)-2)

# Create a visual plot of the data
plt.scatter(x, y)
plt.plot(x, Y_pred, color='red')
plt.xlabel(headerList[0])
plt.ylabel(headerList[1])
# Returns the highest and lowest X and Y values of the graph
leftX, rightX = plt.xlim()
leftY, rightY = plt.ylim()

titleText = ("Simple Linear Regression Graph")
plt.title(titleText, loc='center', fontsize=14)

# Encode the plot image into base64 and pass it to the server
buffer = io.BytesIO()
plt.savefig(buffer, format='jpg')
buffer.seek(0)
base64ImageData = base64.b64encode(buffer.read())
print(json.dumps({'r_val': fourNumFloat % result.rvalue, 'r_2_val': fourNumFloat % RSquared, 'yHat': yHatEquation, 'slope_coefficient': fourNumFloat % result.slope, 'margin_of_error': fourNumFloat % (criticalValue * result.stderr),'img': base64ImageData.decode('utf-8'), 'file_name': file.split("/")[file.count("/")]}))