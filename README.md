This project was created to help with development operations during my time at AWS.  As part of my job, I had to become very comfortable using the AWS CLI, investigate lots of service logs, investigate host properties, etc, in the terminal.  I realized that many of the bash commands I was running were very similar to database queries.  For example, during a customer investigation and deep dive into service logs, I found my self grabbing variables such as customer id, and performing further bash commands using this variable.  These queries returned results similar to a database table (with rows and columns of data).  Some other cli's such as the AWS CLI returned JSON objects and JSON arrays.  This application allows us to turn common scripts and commands in the terminal into a nice user-interface in the browser.

To quickly see some example commands, run `npm run prod`. This will compile the client and the server, and run teh application.  Open your browser to "localhost:3000" to see the application.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run prod`

Builds the client application for production to the `client/build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

##  NOTES

This application should NEVER be deployed to server to be used by more than 1 end user.  The purpose of this application is to be used by the developer running the application as a proxy to running commands in your terminal.  When you are done with the application, it is best to kill the process for security reasons.  If a bad user were to get access to the web application, they could essentially run any terminal commands on your behalf.  This is why the application only accepts connections from "localhost".  If you need access to the web application outside of localhost, I recommend using ssh to do port forwarding using a command like this:
`ssh -l [USERNAME] -L [REMOTE_PORT]:localhost:[LOCAL_PORT] [REMOTE_HOST]`