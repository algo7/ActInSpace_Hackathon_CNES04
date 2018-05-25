//Require Denpedencies
const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

//Global Variable
const port = 2000; //Server Port
const Cred = require('./config/cred'); //Import Credentials
const PDBPath = JSON.parse(JSON.stringify(Cred.Path));
//console.log(PDBPath);

//Initialize Mogoose
mongoose.connect(PDBPath);
mongoose.connection
    .once('open', () => console.log('Connection Established!'))
    .on('error', (err) => {
        console.warn('Error:', err)
    })
    .catch(err => {
        console.log('Error', err)
    });

//Initialize Express
const server = express();

//Initialize body-parser
server.use(
    bodyPaser.urlencoded({
        extended: true
    })
);


//Start the Server
server.listen(port, () => {
    console.log(`Server is now listening on ${port}`);
});