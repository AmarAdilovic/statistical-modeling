const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.use(cors());

app.get(`/data`, async (req, res) => {
    // spawn new child process to call the python script
    const python = spawn('python3', ['statisticalEval.py']);
    // collect data from script
    python.stdout.on('data', (data) => {
        res.send(data.toString())
    });
})
// Only runs once when the server starts running, or whenever the server is reset
app.listen(port, () => console.log(`Listening on port ${port}!`))