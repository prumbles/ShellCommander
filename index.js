const express = require('express');
const path = require('path');
const shell = require('shelljs');
const bodyParser = require('body-parser');
const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

// An api endpoint that returns a short list of items
app.post('/api/shell', (req,res) => {
    console.log(req.body.shell);
    shell.exec(req.body.shell, {silent:false}, function(code, stdout, stderr) {
        if (code !== 0) {
            //error            
            console.log('Program stderr:', stderr);

            var resp = {
                error: stderr
            };

            res.json(resp);
        } else {
            //success
            var resp = {
                text: stdout
            };

            res.json(resp);
        }
    });
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, 'localhost');

console.log('App is listening on port ' + port);