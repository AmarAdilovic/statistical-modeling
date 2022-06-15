GitHub Pages link: https://amaradilovic.github.io/statistical-modeling/

To use:

To use the hosted website, follow the GitHub Pages link, and select the statistical modeling method you would perfer to use. Upload CSV files that need to be analyzed and wait for a response. CSV files must be properly formatted to fit the model or an error will be returned.

How it works:

An implementation of the Express.JS framework to run a server that is hosted on Heroku, the server runs Python files to take advantage of SciPy and returns back statistical analysis and graphs of either randomly generated CSV files, or user entered CSV files. The static front-end is written in HTML, JS, and CSS via JS, and hosted on GitHub Pages. It fetches data from the Heroku server and displays that data to the user.

To run locally: 

All redirects to the hosted site must be changed to localhost:3000.
Run index.html within the client folder, then run "node index.js".
This will run the client and the server, failing to run the server will result in console errors for the client.

File structure:

The client subdirectory contains all front-end related HTML and JS. The csvFiles subdirectory contains generated csv files, and acts as a storage place for user entered csv files. index.js runs the server and calls upon the Python files to return back a JSON object of the generated information.

Procfile, requirements.txt and runtime.txt are all exclusively used to deploy the Heroku server. They are not necessary to run the files locally. However, they do convey useful information on the Python version used and package versions. 
