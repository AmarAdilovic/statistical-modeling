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
                console.log("Removing file");
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
            })
        }
    }
}

app.get(`/getData`, async (req, res) => {
    let passedFileName = req.query.fileName;
    let passedFilePath = req.query.filePath;
    // Spawns a new child process that calls the python script with the default arg
    const python = spawn('python3.9', [passedFileName, passedFilePath]);

    // The data is sent as a buffer from stdout, trueData exists to compile that buffered data
    let trueData = "";
    // collect data from script
    python.stdout.on('data', (data) => {
        trueData += data.toString();
        // Issue with statsmodels package version 13.2.0, exclusively used in ordinaryLeastSquares.py
        trueData = trueData.replace("eval_env: 1", "");
        if(trueData.includes("\"}")){
            console.log("Sending true data");
            return res.send(trueData); }           ;
    });
    python.stdout.on('close', (code) =>{
        console.log(`child process exited with code ${code}`);
        console.log("Data sent.");

    });
})

app.get(`/data/linearRegression`, async (req, res) => {
    let fileName = encodeURIComponent('simpleLinearRegression.py');
    res.redirect('/getData?fileName=' + fileName + '&filePath=default');

})

app.get(`/data/ordinaryLeastSquares`, async (req, res) => {
    let fileName = encodeURIComponent('ordinaryLeastSquares.py');
    res.redirect('/getData?fileName=' + fileName + '&filePath=default');
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

app.get(`/clear-file-cache`, async(req, res) => {  
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
    return res.send(true);
});

app.get(`/data-retrieve/linearRegression`, async (req, res) => {
    // Gets a list of strings of all files within the directory
    const files = fs.readdirSync(__dirname + "/csvFiles/");
    for(let i = 0; i < files.length; i++){
        // Ensures that the first file is a csv file
        if(files[i].includes(".csv")){
            let filePath = encodeURIComponent(__dirname +"/csvFiles/" + files[i]);
            console.log(files[i]);
            let fileName = encodeURIComponent('simpleLinearRegression.py');
            res.redirect('/getData?fileName=' + fileName + '&filePath=' + filePath);
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
            let filePath = encodeURIComponent(__dirname +"/csvFiles/" + files[i]);
            let fileName = encodeURIComponent('ordinaryLeastSquares.py');
            res.redirect('/getData?fileName=' + fileName + '&filePath=' + filePath);
            break;
        }
    }
})


// Only runs once when the server starts running, or whenever the server is reset
app.listen(port, () => console.log(`Listening on port ${port}!`))
