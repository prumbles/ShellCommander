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
                error: (stderr.trim() === '') ? 'Unknown error' : stderr
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

let port = process.env.PORT || 5000;
const args = process.argv.slice(2)
if (args && args.length === 1 && args[0].indexOf('=') > 0) {
    let kv = args[0].split('=')
    if (kv[0] === 'port') {
        port = kv[1]
    }
}

app.listen(port, 'localhost');

console.log('App is listening on port ' + port);
console.log(`WARNING!! Extreme care needs to be taken when running this application!!!
Shell scripts get sent from the browser to the server, and get executed blindly.
This is why this application only allows connections from localhost.
If you need to run this application remotely, please use ssh port forwarding from your local localhost to the remote localhost.
You can use run this command on your machine to forward traffic to the remote host: 
    ssh -l [USERNAME] -L [REMOTE_PORT]:localhost:[LOCAL_PORT] [REMOTE_HOST]`)