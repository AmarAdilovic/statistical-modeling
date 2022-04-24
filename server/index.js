const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = 3000;
const multer  = require('multer')
const path = require('path')
const fs = require('fs');

app.use(cors());

function removeAllCSV(files){
    for(let i = 0; i < files.length; i++){
        let filePath = __dirname +"/" + files[i];

        if(files[i].includes(".csv")){
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

app.get(`/data`, async (req, res) => {
    // Spawns a new child process that calls the python script with the default arg
    const python = spawn('python3', ['statisticalEval.py', "default"]);
    // collect data from script
    python.stdout.on('data', (data) => {
        return res.send(data.toString());
    });
    // After collecting all data, all CSVs are removed from the server directory in the case that a previous run
    // left a hanging csv
    removeAllCSV(fs.readdirSync(__dirname));
})

const storage = multer.diskStorage({
    // Saves the given file into the local (server) directory
    destination: function (req, file, cb) {
        cb(null, __dirname)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Renames csv and appends extension
    }
})

// WARNING: Saving a file to the local directory will cause the VSCode LiveServer extension to refresh the client
// Thus causing this project to be incompatible with LiveServer
const upload = multer({ storage: storage })

app.post(`/data-upload`, upload.single("csv"), async(req, res) => {  
    console.log("File uploaded");
    return res.send(req.file);
});

app.get(`/data-retrieve`, async (req, res) => {
    // Gets a list of strings of all files within the directory
    const files = fs.readdirSync(__dirname);
    // Ensures that the first file is a csv file
    if(files[0].includes("csv")){
        console.log(files[0]);
        // spawn new child process to call the python script
        const python = spawn('python3', ['statisticalEval.py', files[0]]);
        // collect data from script
        let filePath = __dirname +"/" + files[0];

        python.stdout.once('data', (data) => {
            console.log("Python successfully ran");
            return res.send(data.toString());
        });

        python.on('close', (code) =>{
            console.log(`child process exited with code ${code}`);
            fs.rm(filePath, (err) => {
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
            })
            console.log("File removed.");

        });
        
    }
})

// Only runs once when the server starts running, or whenever the server is reset
app.listen(port, () => console.log(`Listening on port ${port}!`))