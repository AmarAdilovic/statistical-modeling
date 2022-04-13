import numpy as np
import matplotlib.pyplot as plt  # To visualize
import pandas as pd  # To read data
from sklearn.linear_model import LinearRegression
from scipy import stats
from scipy.stats import t
import io
import base64
import json

# Reading in any csv file
datafile = "test.csv"
dataFrame = pd.read_csv(datafile)
# Reshapes the data as the data should have a single feature
x = (dataFrame.x).values.reshape(-1,1)
y = (dataFrame.y).values.reshape(-1,1)

# Create object for the LinearRegression class
linear_regressor = LinearRegression()  
# Performs the linear regression
linear_regressor.fit(x, y)
# Makes predictions
Y_pred = linear_regressor.predict(x)  

result = stats.linregress(x[:,0], y[:,0])

# Used to ensure any numbers are rounded to the 4th decimal place
fourNumFloat = "%.4f"

yHat = "ŷ= " + fourNumFloat % result.intercept + " + " + fourNumFloat % result.slope + "x"
RSquared = (result.rvalue)*(result.rvalue)

tinv = lambda p, df: abs(t.ppf(p/2, df))
ts = tinv(0.05, len(x)-2)
# print(f"slope (95%): {result.slope:.4f} +/- {ts*result.stderr:.4f}")

# Create a visual plot of the data
plt.scatter(x, y)
plt.plot(x, Y_pred, color='red')
plt.xlabel('X')
plt.ylabel('Y')
# Returns the highest and lowest X and Y values of the graph
leftX, rightX = plt.xlim()
leftY, rightY = plt.ylim()

plt.text((rightY / 3), (rightX / 3), (yHat), horizontalalignment='center',
      verticalalignment='center')
# Encode the plot image into base64 and pass it to the server
buffer = io.BytesIO()
plt.savefig(buffer, format='jpg')
buffer.seek(0)
base64ImageData = base64.b64encode(buffer.read())
print(json.dumps({'r_val': fourNumFloat % result.rvalue, 'r_2_val': fourNumFloat % RSquared, 'yHat': yHat, 'img': base64ImageData.decode('utf-8')}))
