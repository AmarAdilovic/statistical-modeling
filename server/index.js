const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = 3000;
const multer  = require('multer')
var path = require('path')

app.use(cors());

app.get(`/data`, async (req, res) => {
    // spawn new child process to call the python script
    const python = spawn('python3', ['statisticalEval.py']);
    // collect data from script
    python.stdout.on('data', (data) => {
        res.send(data.toString())
    });
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
    res.send(req.file);
});


// Only runs once when the server starts running, or whenever the server is reset
app.listen(port, () => console.log(`Listening on port ${port}!`))