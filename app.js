//Require Denpedencies
const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const request = require('request');

//Global Variable
const port = 2000; //Server Port
const Cred = require('./config/cred'); //Import Credentials
const PDBPath = JSON.parse(JSON.stringify(Cred.Path)); //Get DB Path
//console.log(PDBPath);
const GAPI = JSON.parse(JSON.stringify(Cred.GAPI)); //Get Google Map API
// const GeoLu =

//Initialize Mogoose
mongoose.connect(PDBPath);
mongoose.connection
  .once('open', () => console.log('Connection Established!'))
  .on('error', err => {
    console.warn('Error:', err);
  })
  .catch(err => {
    console.log('Error', err);
  });

//Initialize Express
const server = express();
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

//Initialize body-parser
server.use(
  bodyPaser.urlencoded({
    extended: true
  })
);

//Get Routes
server.get('/', (req, res) => {
  console.log('Landing Page');
  res.render('fgeo', {});
});

server.get('/nogeo', (req, res) => {
  res.send('Sorry Mate');
});

//Post Routes
server.post('/', (req, res) => {
  console.log('post req./');
  let lat = req.body.latitude;
  let long = req.body.longitude;
  console.log('Longitude:' + long);
  console.log('Latitude:' + lat);
  res.send('Good');
});

//Start the Server
server.listen(port, () => {
  console.log(`Server is now listening on ${port}`);
});
