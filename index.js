const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;
const multer  = require('multer')
const path = require('path')
const fs = require('fs');

app.use(cors());

function removeAllCSV(files){
    console.log("Removing all CSVs");

    for(let i = 0; i < files.length; i++){
        let filePath = __dirname +"/csvFiles/" + files[i];

        if(files[i].includes(".csv")){
            console.log(files[i]);
            fs.rm(filePath, (err) => {
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
            })
        }
    }
}

function getData(python, res){
    // The data is sent as a buffer from stdout, trueData exists to compile that buffered data
    let trueData = "";
    // collect data from script
    python.stdout.on('data', (data) => {
        trueData += data.toString();
        // Issue with statsmodels package version 13.2.0, exclusively used in ordinaryLeastSquares.py
        trueData = trueData.replace("eval_env: 1", "");
        if(trueData.includes("\"}"))
            return res.send(trueData);
    });
    python.on('close', (code) =>{
        console.log(`child process exited with code ${code}`);
        console.log("Data sent.");

    });
}

app.get(`/data/linearRegression`, async (req, res) => {
    // Spawns a new child process that calls the python script with the default arg
    const python = spawn('python3.9', ['simpleLinearRegression.py', "default"]);
    getData(python, res);

})

app.get(`/data/ordinaryLeastSquares`, async (req, res) => {
    // Spawns a new child process that calls the python script with the default arg
    const python = spawn('python3.9', ['ordinaryLeastSquares.py', "default"]);
    getData(python, res);
})

const storage = multer.diskStorage({
    // Saves the given file into the local (server) directory
    destination: function (req, file, cb) {
        cb(null, __dirname + "/csvFiles/")
    },
    filename: function (req, file, cb) {
        cb(null, path.basename(file.originalname)) //Renames csv and appends extension
    }
})

app.post(`/clear-file-cache`, async(req, res) => {  
    // Before sending data, all CSVs are removed from the csvFiles directory in the case that a previous run
    // left a hanging csv
    removeAllCSV(fs.readdirSync(__dirname + "/csvFiles/"));
    return res.send(true);
});

// WARNING: Saving a file to the local directory will cause the VSCode LiveServer extension to refresh the client
// Thus causing this project to be incompatible with LiveServer
const upload = multer({ storage: storage })

app.post(`/data-upload`, upload.single("csv"), async(req, res) => {  
    console.log("File uploaded.");
    return res.send(req.file);
});

function retrieveData(python, filePath, res){
    // The data is sent as a buffer from stdout, trueData exists to compile that buffered data
    let trueData = "";
    // collect data from script
    python.stdout.on('data', (data) => {
        trueData += data.toString();
        // Issue with statsmodels package version 13.2.0, exclusively used in ordinaryLeastSquares.py
        trueData = trueData.replace("eval_env: 1", "");
        if(trueData.includes("\"}"))
            return res.send(trueData);
    });

    python.on('close', (code) =>{
        console.log(`child process exited with code ${code}`);
    });

}

app.get(`/data-retrieve/linearRegression`, async (req, res) => {
    // Gets a list of strings of all files within the directory
    const files = fs.readdirSync(__dirname + "/csvFiles/");
    for(let i = 0; i < files.length; i++){
        // Ensures that the first file is a csv file
        if(files[i].includes(".csv")){
            let filePath = __dirname +"/csvFiles/" + files[i];
            console.log(files[i]);
            // spawn new child process to call the python script
            const python = spawn('python3.9', ['simpleLinearRegression.py', filePath]);
            retrieveData(python, filePath, res);
            break;
        }
    }
})

app.get(`/data-retrieve/ordinaryLeastSquares`, async (req, res) => {
    // Gets a list of strings of all files within the directory
    const files = fs.readdirSync(__dirname + "/csvFiles/");
    for(let i = 0; i < files.length; i++){
        // Ensures that the first file is a csv file
        if(files[i].includes("csv")){
            let filePath = __dirname +"/csvFiles/" + files[i];
            // spawn new child process to call the python script
            const python = spawn('python3.9', ['ordinaryLeastSquares.py', filePath]);
            retrieveData(python, filePath, res);
            break;
        }
    }
})


// Only runs once when the server starts running, or whenever the server is reset
app.listen(port, () => console.log(`Listening on port ${port}!`))
